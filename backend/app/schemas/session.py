# app/schemas/session.py

from pydantic import BaseModel
from datetime import datetime


class SessionCreate(BaseModel):
    title: str
    speaker: str
    start_time: datetime
    end_time: datetime
    capacity: int
