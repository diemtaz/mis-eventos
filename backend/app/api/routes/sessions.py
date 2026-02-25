# app/api/routes/sessions.py

from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.session import get_session
from app.services.session_service import SessionService
from app.schemas.session import SessionCreate

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.post("/")
def create_session(
    event_id: int,
    data: SessionCreate,
    session: Session = Depends(get_session)
):
    return SessionService.create_session(data, event_id, session)


@router.put("/{session_id}")
def update_session(
    session_id: int,
    event_id: int,
    data: SessionCreate,
    session: Session = Depends(get_session)
):
    return SessionService.update_session(
        session_id,
        data,
        event_id,
        session
    )
