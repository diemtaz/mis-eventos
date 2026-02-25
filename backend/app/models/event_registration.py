from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from sqlalchemy import UniqueConstraint


class EventRegistration(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("user_id", "event_id"),
    )
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    event_id: int = Field(foreign_key="event.id", index=True)
    registered_at: datetime = Field(default_factory=datetime.utcnow)
    