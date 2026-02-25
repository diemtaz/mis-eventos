import { HttpClient,HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Event } from '../models/event.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  events = signal<Event[]>([]);

  currentEvent = signal<Event | null>(null);

  /**
   * Obtiene eventos con soporte para paginación
   * @param limit Cantidad de elementos por página
   * @param offset Desplazamiento (ej. (page-1) * limit)
   */
  getEvents(limit: number = 10, offset: number = 0, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(`${this.apiUrl}/`, { params });
  }

  getEventById(id: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      tap(event => this.currentEvent.set(event))
    );
  }
  registerToEvent(eventId: number) {
    return this.http.post(
      `${this.apiUrl}/${eventId}/register`,
      {}
    );
  }

  getMyEvents() {
    return this.http.get<Event[]>(`${environment.apiUrl}/events/me/registrations`);
  }

  createEvent(eventData: Partial<Event>): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/`, eventData);
  }

  updateEvent(id: number, eventData: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, eventData);
  }

  deleteEvent(id: number): Observable<Event> {
    return this.http.delete<Event>(`${this.apiUrl}/${id}`);
  }

}