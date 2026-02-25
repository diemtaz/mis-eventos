from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.event import Event, EventStatus
from app.models.event_registration import EventRegistration


class RegistrationService:

    @staticmethod
    def register_user(event_id: int, user_id: int, session: Session):   

        event = session.exec(
                select(Event)
                .where(Event.id == event_id)
                .with_for_update()
            ).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        if event.status in [EventStatus.CANCELLED]:
            raise HTTPException(status_code=400, detail="Cannot register to this event")

        # Verificar duplicado
        existing = session.exec(
            select(EventRegistration)
            .where(EventRegistration.user_id == user_id)
            .where(EventRegistration.event_id == event_id)
        ).first()

        if existing:
            raise HTTPException(status_code=400, detail="Already registered")

        # Conteo actual
        count = session.exec(
            select(EventRegistration)
            .where(EventRegistration.event_id == event_id)
        ).all()

        if len(count) >= event.capacity:
            event.status = EventStatus.FULL
            session.commit()
            raise HTTPException(status_code=400, detail="Event is full")

        registration = EventRegistration(
            user_id=user_id,
            event_id=event_id
        )

        session.add(registration)

        # Si se llena justo ahora
        if len(count) + 1 >= event.capacity:
            event.status = EventStatus.FULL

        session.commit()

        return {"message": "Registered successfully"}
