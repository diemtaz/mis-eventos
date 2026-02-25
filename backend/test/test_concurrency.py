import threading
from datetime import datetime  # <--- Importar esto
from sqlmodel import Session, select
from app.models.event import Event
from app.models.user import User
from app.models.event_registration import EventRegistration
from app.services.registration_service import RegistrationService

from test.conftest import test_engine as engine 

def register(event_id, user_id):
    """Worker para concurrencia"""
    with Session(engine) as session:
        try:
            RegistrationService.register_user(event_id, user_id, session)
            session.commit()
        except Exception:
            session.rollback()

def test_capacity_not_exceeded():

    with Session(engine) as session:
        session.execute(EventRegistration.__table__.delete())
        session.execute(Event.__table__.delete())
        session.execute(User.__table__.delete())
        session.commit()


    with Session(engine) as session:
        user = User(
            email="test_concurrency@test.com",
            password_hash="hash",
            role="ORGANIZER"
        )
        session.add(user)
        session.commit()
        session.refresh(user) 
        user_id = user.id

    with Session(engine) as session:
        event = Event(
            name="Test",
            description="Test",
            capacity=1,
            start_date=datetime.fromisoformat("2026-01-01T10:00:00"),
            end_date=datetime.fromisoformat("2026-01-01T12:00:00"),
            created_by=user_id
        )
        session.add(event)
        session.commit()
        session.refresh(event)
        event_id = event.id

    thread1 = threading.Thread(target=register, args=(event_id, user_id))
    thread2 = threading.Thread(target=register, args=(event_id, user_id))

    thread1.start()
    thread2.start()

    thread1.join()
    thread2.join()

    with Session(engine) as session:
        count = session.exec(
            select(EventRegistration)
            .where(EventRegistration.event_id == event_id)
        ).all()

        assert len(count) == 1