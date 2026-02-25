import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event';
import { Event } from '../models/event.model';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8000/events'; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });
    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debe obtener la lista de eventos (GET)', () => {
    const mockResponse = { items: [{ id: 1, name: 'Angular Tech' }], total: 1 };
    
    service.getEvents().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(req => 
      req.url === `${baseUrl}/` && 
      req.params.has('limit') && 
      req.params.has('offset')
    );
    
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debe obtener un evento por ID y actualizar el signal (GET)', () => {
    const mockEvent = { id: 1, name: 'Evento Detalle' } as Event;
    
    service.getEventById(1).subscribe(event => {
      expect(event).toEqual(mockEvent);
      
      expect(service.currentEvent()).toEqual(mockEvent);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEvent);
  });

  it('debe registrarse a un evento (POST)', () => {
    service.registerToEvent(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush({});
  });

  it('debe crear un nuevo evento (POST)', () => {
    const newEvent = { name: 'Nuevo' } as Partial<Event>;
    const responseEvent = { id: 99, ...newEvent } as Event;

    service.createEvent(newEvent).subscribe(event => {
      expect(event).toEqual(responseEvent);
    });

    const req = httpMock.expectOne(`${baseUrl}/`);
    expect(req.request.method).toBe('POST');
    req.flush(responseEvent);
  });

  it('debe actualizar un evento (PUT)', () => {
    const updateData = { name: 'Actualizado' };
    service.updateEvent(1, updateData).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('debe eliminar un evento (DELETE)', () => {
    service.deleteEvent(1).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});