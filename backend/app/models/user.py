from sqlmodel import SQLModel, Field
from sqlalchemy import String
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    ORGANIZER = "ORGANIZER"
    ASSISTANT = "ASSISTANT"


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    email: str = Field(
        sa_type=String(255),
        index=True,
        unique=True,
        nullable=False
    )

    password_hash: str = Field(
        sa_type=String(255),
        nullable=False
    )

    role: UserRole = Field(default=UserRole.ASSISTANT)