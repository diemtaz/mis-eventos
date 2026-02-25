from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.models.event import Event, EventStatus
from app.schemas.event import EventCreate, EventRead, EventPagination
from app.services.event_service import EventService
from app.api.deps import get_current_user, require_organizer
from app.models.user import User, UserRole
from app.services.registration_service import RegistrationService
from datetime import datetime, UTC
from app.core.cache import redis_client
import json
from app.core.cache import invalidate_events_cache
from fastapi.encoders import jsonable_encoder
from app.models.event_registration import EventRegistration
from sqlalchemy import func

router = APIRouter(prefix="/events", tags=["Events"])

@router.post("/", response_model=EventRead)
async def create_event(
    event_data: EventCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):

    new_event = EventService.create_event(event_data, current_user.id, session)
    
    invalidate_events_cache()

    return new_event

# app/api/routes/events.py
@router.get("/", response_model=EventPagination)
def list_events(
    offset: int = 0, 
    limit: int = 10,
    search: str = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user) 
):
    user_role = current_user.role if current_user else "guest"
    cache_key = f"events:{user_role}:{offset}:{limit}:{search}"

    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)
    query_base = select(Event)
    
    if user_role not in [UserRole.ADMIN, UserRole.ORGANIZER]:
        query_base = query_base.where(Event.status == EventStatus.PUBLISHED).where(Event.is_deleted == False)
    
    if search:
        query_base = query_base.where(Event.name.ilike(f"%{search}%"))

    total = session.exec(select(func.count()).select_from(query_base.subquery())).one()

    query_data = query_base.order_by(Event.start_date.asc()).offset(offset).limit(limit)
    events = session.exec(query_data).all()

    result = {
        "items": events,
        "total": total
    }

    redis_client.set(cache_key, json.dumps(jsonable_encoder(result)), ex=60)
    
    return result



@router.get("/{event_id}", response_model=EventRead)
def get_event(event_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user) ):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return event


@router.put("/{event_id}", response_model=EventRead)
def update_event(
    event_id: int,
    event_data: EventCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    event.updated_at = datetime.utcnow()

    invalidate_events_cache()

    return EventService.update_event(event, event_data, session)
    
@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    
    invalidate_events_cache()

    return EventService.delete_event(event, current_user, session)


@router.post("/{event_id}/register")
def register_to_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    invalidate_events_cache()
    return RegistrationService.register_user(event_id, current_user.id, session)

@router.get("/me/registrations")
def my_events(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    registrations = session.exec(
        select(Event)
        .join(EventRegistration)
        .where(EventRegistration.user_id == current_user.id)
    ).all()

    return registrations
