import { TestBed } from '@angular/core/testing';
import { EventStore } from './event-store';
import { EventService } from '@core/services/event';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Event } from '@core/models/event.model';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('EventStore', () => {
  let store: EventStore;
  let eventServiceMock: any;
  let routerMock: any;

  const mockEvent = { id: 1, name: 'Angular Tech' } as Event;

  beforeEach(() => {
    vi.useFakeTimers();
    eventServiceMock = {
      getEvents: vi.fn().mockReturnValue(of([mockEvent])),
      getEventById: vi.fn().mockReturnValue(of(mockEvent)),
      createEvent: vi.fn().mockReturnValue(of({ id: 2, name: 'Nuevo' } as Event)),
      updateEvent: vi.fn().mockReturnValue(of({ id: 1, name: 'Actualizado' } as Event)),
      deleteEvent: vi.fn().mockReturnValue(of({})),
      getMyEvents: vi.fn().mockReturnValue(of([mockEvent])),
      registerToEvent: vi.fn().mockReturnValue(of({}))
    };
    routerMock = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        EventStore,
        { provide: EventService, useValue: eventServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
    store = TestBed.inject(EventStore);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('debe cargar eventos y manejar éxito/error', () => {
    store.loadEvents();
    expect(store.events()).toEqual([mockEvent]);

    eventServiceMock.getEvents.mockReturnValue(throwError(() => new Error()));
    store.loadEvents();
    expect(store.error()).toBe('Error al cargar la lista de eventos');
  });

  it('debe cargar evento por ID y manejar error', () => {
    store.loadEventById(1);
    expect(store.selectedEvent()).toEqual(mockEvent);

    eventServiceMock.getEventById.mockReturnValue(throwError(() => new Error()));
    store.loadEventById(99);
    expect(store.error()).toBe('Evento no encontrado');
  });

  it('debe limpiar el evento seleccionado', () => {
    store.selectedEvent.set(mockEvent);
    store.clearSelectedEvent();
    expect(store.selectedEvent()).toBeNull();
  });

  it('debe registrarse y cargar mis eventos', () => {
    const spy = vi.spyOn(store, 'loadMyEvents');
    store.registerToEvent(1);
    expect(spy).toHaveBeenCalled();
    
    eventServiceMock.registerToEvent.mockReturnValue(throwError(() => new Error()));
    store.registerToEvent(1);
    expect(store.error()).toBe('No se pudo registrar al evento');
  });

  it('debe manejar error al cargar mis eventos', () => {
    eventServiceMock.getMyEvents.mockReturnValue(throwError(() => new Error()));
    store.loadMyEvents();
    expect(store.error()).toBe('No se pudieron cargar tus eventos');
  });

  it('debe crear evento y limpiar mensaje tras timeout', () => {
    store.createEvent({ name: 'Nuevo' });
    expect(store.successMessage()).toBe('Evento creado con éxito');
    vi.advanceTimersByTime(5000);
    expect(store.successMessage()).toBeNull();
  });

  it('debe manejar error en creación con detalle del backend', () => {
    eventServiceMock.createEvent.mockReturnValue(throwError(() => ({ error: { detail: 'Custom Error' } })));
    store.createEvent({});
    expect(store.error()).toBe('Custom Error');
  });

  it('debe actualizar evento y navegar tras timeout', () => {
    store.events.set([mockEvent]);
    store.updateEvent(1, { name: 'Actualizado' });
    expect(store.successMessage()).toBe('Evento actualizado con éxito');
    
    vi.advanceTimersByTime(1500);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/events', 1]);
    expect(store.successMessage()).toBeNull();
  });

  it('debe eliminar evento y limpiar mensaje tras timeout', () => {
    store.events.set([mockEvent]);
    store.deleteEvent(1);
    vi.advanceTimersByTime(1000);
    expect(store.events().length).toBe(0);
    expect(store.successMessage()).toBeNull();
  });

  it('debe manejar errores en update y delete', () => {
    eventServiceMock.updateEvent.mockReturnValue(throwError(() => ({ error: { detail: 'Err Upd' } })));
    store.updateEvent(1, {});
    expect(store.error()).toBe('Err Upd');

    eventServiceMock.deleteEvent.mockReturnValue(throwError(() => ({ error: { detail: 'Err Del' } })));
    store.deleteEvent(1);
    expect(store.error()).toBe('Err Del');
  });

  it('debe calcular isAlreadyRegistered en todas sus ramas', () => {
    store.selectedEvent.set(null);
    expect(store.isAlreadyRegistered()).toBe(false);

    store.selectedEvent.set(mockEvent);
    store.myEvents.set([{ id: 2 } as Event]);
    expect(store.isAlreadyRegistered()).toBe(false);

    store.myEvents.set([mockEvent]);
    expect(store.isAlreadyRegistered()).toBe(true);
  });
});