# app/services/session_service.py

from sqlmodel import Session, select
from fastapi import HTTPException
from app.models.session import Session as EventSession
from app.models.event import Event


class SessionService:

    # ------------------------------
    # VALIDACIÓN DE CONFLICTO HORARIO
    # ------------------------------

    @staticmethod
    def validate_schedule_conflict(
        session_id,
        event_id,
        new_start,
        new_end,
        db_session: Session
    ):

        query = select(EventSession).where(
            EventSession.event_id == event_id
        )

        if session_id:
            query = query.where(EventSession.id != session_id)

        sessions = db_session.exec(
                    select(EventSession)
                    .where(EventSession.event_id == event_id)
                    .with_for_update()
                ).all()

        for s in sessions:
            if new_start < s.end_time and new_end > s.start_time:
                raise HTTPException(
                    status_code=400,
                    detail="Schedule conflict detected"
                )

    # ------------------------------
    # CREAR SESSION
    # ------------------------------

    @staticmethod
    def create_session(data, event_id: int, db_session: Session):

        # Validación conflicto horario
        SessionService.validate_schedule_conflict(
            session_id=None,
            event_id=event_id,
            new_start=data.start_time,
            new_end=data.end_time,
            db_session=db_session
        )

        session = EventSession(
            event_id=event_id,
            title=data.title,
            speaker=data.speaker,
            start_time=data.start_time,
            end_time=data.end_time,
            capacity=data.capacity
        )

        db_session.add(session)
        db_session.commit()
        db_session.refresh(session)

        return session

    # ------------------------------
    # ACTUALIZAR SESSION
    # ------------------------------

    @staticmethod
    def update_session(session_id, data, event_id: int, db_session: Session):

        session_obj = db_session.get(EventSession, session_id)

        if not session_obj:
            raise HTTPException(status_code=404, detail="Session not found")

        # Validar conflicto horario antes de actualizar
        SessionService.validate_schedule_conflict(
            session_id=session_id,
            event_id=event_id,
            new_start=data.start_time,
            new_end=data.end_time,
            db_session=db_session
        )

        session_obj.title = data.title
        session_obj.speaker = data.speaker
        session_obj.start_time = data.start_time
        session_obj.end_time = data.end_time
        session_obj.capacity = data.capacity

        db_session.commit()
        db_session.refresh(session_obj)

        return session_obj
