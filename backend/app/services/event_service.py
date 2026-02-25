from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.event import Event, EventStatus
from datetime import datetime


class EventService:

    @staticmethod
    def create_event(data, user_id: int, session: Session):

        if data.capacity < 1:
            raise HTTPException(status_code=400, detail="Capacity must be greater than 0")

        if data.start_date >= data.end_date:
            raise HTTPException(status_code=400, detail="Invalid date range")

        event = Event(
            **data.dict(),
            created_by=user_id
        )

        session.add(event)
        session.commit()
        session.refresh(event)

        return event

    @staticmethod
    def update_event(event: Event, data, session: Session):

        if event.status == EventStatus.CANCELLED:
            raise HTTPException(status_code=400, detail="Cannot modify cancelled event")

        for key, value in data.dict(exclude_unset=True).items():
            setattr(event, key, value)

        session.commit()
        session.refresh(event)

        return event

    @staticmethod
    def cancel_event(event: Event, session: Session):

        if event.status == EventStatus.CANCELLED:
            raise HTTPException(
                status_code=400,
                detail="Event already cancelled"
            )

        event.status = EventStatus.CANCELLED

        session.commit()
        session.refresh(event)

        return event

    @staticmethod
    def publish_event(event: Event, session: Session):

        if event.status == EventStatus.CANCELLED:
            raise HTTPException(
                status_code=400,
                detail="Cancelled event cannot be published"
            )

        event.status = EventStatus.PUBLISHED

        session.commit()
        session.refresh(event)

        return event
