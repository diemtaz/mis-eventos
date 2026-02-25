from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from enum import Enum
from datetime import datetime, UTC
from app.models.user import User
import sqlalchemy as sa


class EventStatus(str, Enum):
    PUBLISHED = "PUBLISHED"
    FULL = "FULL"
    CANCELLED = "CANCELLED"


class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(sa_type=sa.String(255), index=True)
    description: str = Field(sa_type=sa.String(255))
    speaker_name: Optional[str] = Field(default=None, sa_type=sa.String(100))
    capacity: int
    start_date: datetime
    end_date: datetime
    status: EventStatus = Field(default=EventStatus.PUBLISHED)

    created_by: int = Field(foreign_key="user.id", index=True)
    is_deleted: bool = Field(default=False, index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
