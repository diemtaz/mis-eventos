from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.event import Event, EventStatus
from datetime import datetime
from app.schemas.event import EventCreate
from app.models.user import User


class EventService:

    @staticmethod
    def create_event(data: EventCreate, user_id: int, session: Session):
        if data.capacity < 1:
            raise HTTPException(status_code=400, detail="La capacidad debe ser mayor a 0")

        if data.start_date >= data.end_date:
            raise HTTPException(status_code=400, detail="La fecha de inicio debe ser anterior a la de fin")

        statement = select(Event).where(
            Event.speaker_name == data.speaker_name,
            Event.is_deleted == False,
            Event.start_date < data.end_date,
            Event.end_date > data.start_date
        )
        conflict = session.exec(statement).first()
        
        if conflict:
            raise HTTPException(
                status_code=400, 
                detail=f"El ponente {data.speaker_name} ya tiene un compromiso en este horario."
            )

        event = Event(
            **data.model_dump(),
            created_by=user_id
        )

        session.add(event)
        session.commit()
        session.refresh(event)

        return event

    @staticmethod
    def update_event(event: Event, data, session: Session):
        update_data = data.dict(exclude_unset=True)

        if "status" in update_data:
            new_status = update_data["status"]
            if new_status != EventStatus.CANCELLED:
                event.is_deleted = False 
            else:
                event.is_deleted = True

        for key, value in update_data.items():
            setattr(event, key, value)

        session.add(event)
        session.commit()
        session.refresh(event)

        return event

    @staticmethod
    def delete_event(event: Event, user: User, session: Session):

        if event.is_deleted:
            raise HTTPException(
                status_code=400,
                detail="Evento ya fue borrado"
            )
        
        if user.role != "admin" and event.created_by != user.id:
            raise HTTPException(status_code=403, detail="No tienes permiso para borrar este evento")

        if event.is_deleted:
            raise HTTPException(status_code=400, detail="Evento ya fue borrado")

        event.is_deleted = True
        event.status = EventStatus.CANCELLED

        session.commit()
        session.refresh(event)

        return event
