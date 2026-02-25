from fastapi import FastAPI
from app.api.routes import auth, events
from app.db.session import engine
from sqlmodel import SQLModel
from app.models.event import Event
from app.models.event_registration import EventRegistration


app = FastAPI()

app.include_router(auth.router)
app.include_router(events.router)
