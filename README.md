# Mis Eventos

Sistema integral para la gestión de eventos, diseñado con una arquitectura desacoplada, escalable y orientada a buenas prácticas modernas de desarrollo Fullstack.

El proyecto está compuesto por:

- Frontend SPA en Angular
- Backend API REST en FastAPI
- Base de datos relacional
- Sistema de cacheo
- Contenerización completa con Docker

---

# Arquitectura de Alto Nivel

La solución está organizada en una arquitectura desacoplada por capas:

```text
┌───────────────┐
│ Frontend │ Angular 21 + Signals
│ (SPA) │
└───────▲───────┘
│ HTTP (REST + JWT)
▼
┌───────────────┐
│ Backend │ FastAPI + SQLModel
│ (API) │
└───────▲───────┘
│ ORM
▼
┌───────────────┐
│ Base Datos │ SQLite / PostgreSQL
└───────────────┘
▲
│ Cache
▼
┌───────────────┐
│ Redis │
└───────────────┘
```

### Principios aplicados:

- Separación de responsabilidades
- Arquitectura modular
- Comunicación vía API REST
- Autenticación basada en JWT
- Manejo de estado reactivo en frontend
- Control de concurrencia en backend
- Orquestación con Docker Compose

---

# Módulos del Proyecto

## Frontend (Angular)

Aplicación SPA desarrollada con Angular 21 utilizando:

- Standalone Components
- Angular Signals (State Management)
- Guards e Interceptors
- Lazy Loading
- Testing

📎 Ver documentación completa del frontend:   
[Ir al README de Frontend](./frontend/README.md)

---

## Backend (FastAPI)

API RESTful desarrollada con:

- FastAPI
- Python 3.12
- SQLModel
- Validaciones asíncronas
- Manejo de concurrencia en registros
- Control de capacidad en eventos
- Documentación automática con Swagger

📎 Ver documentación completa del backend:   
[Ir al README de Backend](./backend/README.md)

---

#  Stack Tecnológico Unificado

| Capa            | Tecnología                    | Propósito |
|---------------|------------------------------|-----------|
| Frontend      | Angular 21 + Signals        | SPA reactiva y moderna |
| Backend       | FastAPI + Python 3.12       | API de alto rendimiento |
| ORM           | SQLModel                    | Persistencia tipada y validada |
| Base de Datos | SQLite / PostgreSQL         | Almacenamiento relacional |
| Caché         | Redis                       | Optimización de consultas frecuentes |
| Infraestructura | Docker & Docker Compose   | Entorno reproducible |

---

# Flujos Críticos de Negocio

## Gestión de Concurrencia

Se implementa control de capacidad en tiempo real para:

- Evitar registros duplicados
- Prevenir sobrecupos
- Garantizar consistencia transaccional

El backend valida disponibilidad antes de confirmar registros.

---

## Sincronización de Datos

- Listados paginados desde base de datos
- Filtrado eficiente
- Estado reactivo en frontend mediante Signals
- Actualización automática de UI tras mutaciones

---

## Seguridad

- Autenticación JWT
- Protección de rutas en frontend
- Validación de permisos en backend
- Interceptors automáticos para token

---

#  Calidad y Testing

## Frontend

- Tests unitarios de stores
- Tests de servicios HTTP
- Tests de componentes
- Tests de guards

## Backend

- Tests de endpoints
- Validación de flujos críticos
- Validación de reglas de negocio

---

# Guía de Inicio Rápido (Fullstack)

## Requisitos

- Docker
- Docker Compose

---

## Levantar el entorno completo

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/mis-eventos.git

cd mis-eventos

# Construir y levantar servicios
docker-compose up --build
```
Accesos

Frontend:

http://localhost:4200

Backend:

http://localhost:8000

Documentación API (Swagger):

http://localhost:8000/docs


Autor

Proyecto desarrollado como prueba técnica de liderazgo técnico por Diego Fernando Marin Marin.

