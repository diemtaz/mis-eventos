from sqlmodel import SQLModel
from datetime import datetime
from app.models.event import EventStatus


class EventCreate(SQLModel):
    name: str
    description: str
    capacity: int
    start_date: datetime
    end_date: datetime


class EventRead(SQLModel):
    id: int
    name: str
    description: str
    capacity: int
    start_date: datetime
    end_date: datetime
    status: EventStatus
