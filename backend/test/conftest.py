import os
import pytest

# 1. FORZAR LA URL DE TEST ANTES DE CARGAR LA APP
# Esto garantiza que 'settings.database_url' sea el archivo SQLite
os.environ["DATABASE_URL"] = "sqlite:////code/test.db"

from sqlmodel import SQLModel, create_engine, Session, select
from starlette.testclient import TestClient

# Importaciones de la aplicación
from app.core.config import settings
from app.main import app
from app.db.session import get_session
from app.models.user import User, UserRole
from app.core.security import hash_password
from app.models.event_registration import EventRegistration

# -------------------------------------------------
# Configuración del Motor de Pruebas
# -------------------------------------------------

# Usamos la URL forzada. connect_args es vital para SQLite en Docker.
test_engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False},
)

# -------------------------------------------------
# Overrides de Dependencias
# -------------------------------------------------

def override_get_session():
    """Inyecta la sesión de SQLite en los endpoints de FastAPI"""
    with Session(test_engine) as session:
        yield session

# Aplicar el override global
app.dependency_overrides[get_session] = override_get_session

# -------------------------------------------------
# Ciclo de Vida (Lifecycle)
# -------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """
    Crea físicamente las tablas en /code/test.db al iniciar.
    Si el archivo no existe, SQLite lo crea automáticamente.
    """
    SQLModel.metadata.create_all(test_engine)
    yield
    # Opcional: SQLModel.metadata.drop_all(test_engine)

# -------------------------------------------------
# Fixtures para los Tests
# -------------------------------------------------

@pytest.fixture
def client():
    """Cliente para simular peticiones HTTP"""
    with TestClient(app) as client:
        yield client

@pytest.fixture
def token(client):
    """
    Crea un usuario con rol ORGANIZER en la DB de test y genera su token.
    Este paso es crítico para evitar el error 403.
    """
    test_email = "test@test.com"
    test_password = "123456"

    with Session(test_engine) as session:
        # Verificar si el usuario ya existe en test.db
        user = session.exec(select(User).where(User.email == test_email)).first()
        
        if not user:
            user = User(
                email=test_email,
                password_hash=hash_password(test_password),
                role=UserRole.ORGANIZER  # Se guarda como ORGANIZER
            )
            session.add(user)
            session.commit()
            session.refresh(user)

    # Obtener el token mediante el endpoint de login
    response = client.post(
        "/auth/login",
        data={
            "username": test_email,
            "password": test_password
        }
    )
    
    if response.status_code != 200:
        raise ValueError(f"No se pudo obtener el token de test: {response.text}")

    return response.json()["access_token"]

@pytest.fixture(autouse=True)
def clean_database():
    """Limpia las tablas antes de cada test para evitar conflictos de Duplicados."""
    with Session(test_engine) as session:
        # El orden importa por las llaves foráneas (Foreign Keys)
        session.execute(select(EventRegistration)).all() # Solo para asegurar carga
        from sqlalchemy import text
        session.execute(text("DELETE FROM eventregistration"))
        session.execute(text("DELETE FROM event"))
        session.execute(text('DELETE FROM "user"'))
        session.commit()
    yield