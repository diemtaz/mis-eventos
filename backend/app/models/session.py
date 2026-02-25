# app/models/session.py

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import sqlalchemy as sa


class Session(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    event_id: int = Field(foreign_key="event.id", index=True)
    title: str = Field(sa_type=sa.String(255))
    speaker: str = Field(sa_type=sa.String(255))
    start_time: datetime
    end_time: datetime
    capacity: int
