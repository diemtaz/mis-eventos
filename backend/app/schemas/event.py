from sqlmodel import SQLModel
from datetime import datetime
from app.models.event import EventStatus
from typing import Optional, List
from pydantic import BaseModel


class EventCreate(SQLModel):
    name: str
    description: str
    speaker_name: str
    capacity: int
    start_date: datetime
    end_date: datetime
    status: EventStatus


class EventRead(SQLModel):
    id: int
    name: str
    description: str
    speaker_name: Optional[str] = None
    capacity: int
    start_date: datetime
    end_date: datetime
    status: EventStatus

class EventPagination(BaseModel):
    items: List[EventRead]
    total: int
