from sqlmodel import create_engine, Session
from app.core.config import settings

def get_engine():
    # Si la URL es sqlite, no enviamos opciones de Postgres
    connect_args = {}
    if "postgresql" in settings.database_url:
        connect_args = {"options": "-c timezone=utc"}
    elif "sqlite" in settings.database_url:
        connect_args = {"check_same_thread": False}

    return create_engine(
        settings.database_url,
        future=True,
        echo=True,
        connect_args=connect_args
    )

engine = get_engine()

def get_session():
    with Session(engine) as session:
        yield session