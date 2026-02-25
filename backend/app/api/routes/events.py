from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from app.db.session import get_session
from app.models.event import Event
from app.schemas.event import EventCreate, EventRead
from app.services.event_service import EventService
from app.api.deps import get_current_user, require_organizer
from app.models.user import User
from app.services.registration_service import RegistrationService
from datetime import datetime, UTC
from app.core.cache import redis_client
import json
from app.core.cache import invalidate_events_cache
from fastapi.encoders import jsonable_encoder
from app.models.event_registration import EventRegistration

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/", response_model=EventRead)
def create_event(
    event_data: EventCreate,
    session: Session = Depends(get_session),
    current_user = Depends(require_organizer)
):
    invalidate_events_cache()
    return EventService.create_event(event_data, current_user.id, session)


@router.get("/", response_model=List[EventRead])
def list_events(
    page: int = 1,
    limit: int = 10,
    search: str = None,
    session: Session = Depends(get_session)
):

    cache_key = f"events:{page}:{limit}:{search}"

    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    offset = (page - 1) * limit

    query = select(Event).where(Event.is_deleted == False)

    if search:
        query = query.where(Event.name.ilike(f"%{search}%"))

    query = query.offset(offset).limit(limit)

    events = session.exec(query).all()

    redis_client.set(
                cache_key,
                json.dumps(jsonable_encoder(events)),
                ex=60
            )
    return events



@router.get("/{event_id}", response_model=EventRead)
def get_event(event_id: int, session: Session = Depends(get_session)):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
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
        raise HTTPException(status_code=404, detail="Event not found")
    
    event.updated_at = datetime.utcnow()

    return EventService.update_event(event, event_data, session)

@router.post("/{event_id}/publish")
def publish_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_user = Depends(require_organizer)
):

    event = session.get(Event, event_id)

    return EventService.publish_event(event, session)
    
@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    event = session.get(Event, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    event.is_deleted = True
    session.commit()

    return {"message": "Event deleted"}

@router.post("/{event_id}/cancel")
def cancel_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_user = Depends(require_organizer)
):

    event = session.get(Event, event_id)

    return EventService.cancel_event(event, session)

@router.post("/{event_id}/register")
def register_to_event(
    event_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
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
