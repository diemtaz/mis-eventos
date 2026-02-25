# Mis Eventos - Frontend

Aplicación frontend desarrollada en **Angular** para la gestión de eventos con autenticación JWT, arquitectura basada en Signals y alta cobertura de testing.

El sistema permite:

- Registro y autenticación de usuarios
- Listado y detalle de eventos
- Creación y edición de eventos
- Registro a eventos
- Visualización de eventos registrados (Profile)
- Manejo global de estado reactivo
- Protección de rutas
- Confirmaciones mediante modal
- Testing

---

## Stack Tecnológico

- Angular (Standalone Components)
- Angular Router
- Angular Signals (State Management)
- HttpClient
- JWT Authentication
- SCSS
- Vitest
- Docker

---

## Arquitectura del Proyecto

El proyecto está organizado siguiendo separación por responsabilidades:

```text
src/app/
├── core/
│ ├── services/
│ ├── store/
│ ├── guards/
│ └── interceptors/
│
├── shared/
│ └── components/
│
├── features/
│ ├── auth/
│ ├── events/
│ └── profile/
│
└── environments/
```

## Principios aplicados:
State Management con Signals: Gestión de estado atómica sin librerías externas.

Lazy Loading: Carga bajo demanda de módulos funcionales para optimizar el bundle inicial.

Smart & Dumb Components: Separación de la lógica de negocio y la presentación.

Defensive Programming: Tipado fuerte y manejo explícito de estados de carga y error.

---

## Gestión de Estado

A diferencia de enfoques tradicionales con RxJS/NgRx, el sistema utiliza un Patrón Store personalizado basado en **Angular Signals**.

Stores implementados:
- `AuthStore`: Centraliza la sesión, roles y persistencia del JWT.

- `EventStore`: Gestiona el catálogo, la **sincronización de paginación** y los criterios de búsqueda.

> **Nota de Implementación**: El Store coordina los parámetros de consulta (`page`, `limit`, `search`) asegurando que el estado de la UI y los datos del servidor estén siempre alineados, incluso ante cambios rápidos en el buscador.

Cada store gestiona:

- Estado reactivo
- Loading states
- Manejo de errores
- Llamadas a servicios
- Actualización automática de la UI

Beneficios obtenidos:

Reactividad granular: Solo se actualizan los componentes vinculados a la señal específica.

Simplificación: Reducción drástica de código boilerplate y manejo complejo de observables.

Consistencia: Un flujo de datos unidireccional que facilita la depuración.

---

## Autenticación

El sistema utiliza JWT para autenticación:

1. Login devuelve token.
2. Token almacenado en `AuthStore`.
3. `JwtInterceptor` adjunta el token en cada request.
4. `AuthGuard` protege rutas privadas.
5. `GuestGuard` evita acceso a login/register si el usuario ya está autenticado.

---

## Funcionalidades Implementadas

### Eventos

- **Listado Paginado**: Navegación eficiente mediante `offset/limit` sincronizada con el backend.
- **Búsqueda Avanzada**: Filtrado reactivo de eventos por nombre con persistencia de estado.
- Listado de eventos
- Detalle de evento
- Registro a evento
- Creación de eventos
- Edición de eventos
- Confirmación mediante modal
- Manejo de loading y errores

### Autenticación

- Registro de usuario
- Login
- Persistencia de sesión
- Protección de rutas
- Redirecciones automáticas

### Perfil

- Visualización de eventos registrados
- Estado reactivo desde Store

---

## Rutas

| Ruta | Descripción | Protección |
|------|------------|------------|
| `/events` | Listado con soporte para paginación y filtros | Protegida |
| `/events/:id` | Detalle de evento | Protegida |
| `/events/create` | Crear evento | Protegida |
| `/events/:id/edit` | Editar evento | Protegida |
| `/login` | Login | GuestGuard |
| `/register` | Registro | GuestGuard |
| `/profile` | Eventos registrados | AuthGuard |

---

## Comunicación con Backend

Se consumen endpoints REST para:

- Autenticación
- Registro de usuario
- CRUD de eventos
- Registro a eventos
- Consulta de perfil

Todas las peticiones HTTP se realizan mediante `HttpClient` y son interceptadas automáticamente para adjuntar el JWT cuando corresponde.

---

## Testing

El proyecto cuenta con test mediante Vitest.

Los tests cubren:

- Stores
- Servicios
- Componentes principales
- Guards
- Lógica crítica de negocio

## Ejecutar suite de pruebas completa
```bash
ng test
```

## Generar reporte detallado de cobertura
```bash
ng test --coverage
```

---

## Componentes Reutilizables

En `shared/components/`:

- `EventCard`
- `ConfirmModal`
- Componentes UI desacoplados

---

## Instalación y Despliegue
### Usando Docker (Recomendado)
```bash

docker-compose up --build
```
### Desarrollo Local
```bash

# 1. Instalar dependencias
npm install

# 2. Levantar el servidor
ng serve
```

Disponible en: http://localhost:4200


## Autor

Proyecto desarrollado como prueba técnica de liderazgo técnico por Diego Fernando Marin Marin.