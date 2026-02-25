import { Injectable, signal, inject, computed} from '@angular/core';
import { Event } from '@core/models/event.model';
import { EventService } from '@core/services/event';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EventStore {

  private eventService = inject(EventService);
  private router = inject(Router); 
  
  events = signal<Event[]>([]);
  selectedEvent = signal<Event | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  myEvents = signal<Event[]>([]);
  successMessage = signal<string | null>(null);
  totalEvents = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);
  searchTerm = signal<string>('');

  isAlreadyRegistered = computed(() => {
    const selected = this.selectedEvent();
    if (!selected) return false;
    return this.myEvents().some(e => e.id === selected.id);
  });


  loadEvents(page: number = 1, search: string = this.searchTerm()) {
    this.loading.set(true);
    const limit = this.pageSize();
    const offset = (page - 1) * limit;

    this.eventService.getEvents(limit, offset, search).subscribe({
      next: (response: any) => {
        this.events.set(response.items || response); 
        this.totalEvents.set(response.total || response.length);
        this.currentPage.set(page);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar la lista de eventos');
        this.loading.set(false);
      }
    });
  }

  loadEventById(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.getEventById(id).subscribe({
      next: (data) => {
        this.selectedEvent.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Evento no encontrado');
        this.loading.set(false);
      }
    });
  }

  clearSelectedEvent() {
    this.selectedEvent.set(null);
  }

  registerToEvent(eventId: number) {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.registerToEvent(eventId).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('¡Registro exitoso! Te esperamos.');
        this.loadMyEvents();
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('No se pudo registrar al evento');
      }
    });
  }

  loadMyEvents() {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.getMyEvents().subscribe({
      next: (data) => {
        this.myEvents.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus eventos');
        this.loading.set(false);
      }
    });
  }

  createEvent(eventData: Partial<Event>) {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.createEvent(eventData).subscribe({
      next: (newEvent: Event) => {
        this.events.update(prev => [newEvent, ...prev]);
        this.loading.set(false);
        this.successMessage.set('Evento creado con éxito');
        this.router.navigate(['/events']);
        setTimeout(() => this.successMessage.set(null), 5000);
      },
      error: (err) => {
        this.loading.set(false);
        const message = err.error?.detail || 'Error inesperado';
        this.error.set(message); 
      }
    });
  }

  updateEvent(id: number, eventData: Partial<Event>) {
    this.loading.set(true);
    this.error.set(null);

    this.eventService.updateEvent(id, eventData).subscribe({
      next: (updatedEvent: Event) => {
        this.events.update(prev => prev.map(e => e.id === id ? updatedEvent : e));
        
        this.selectedEvent.set(updatedEvent);
        
        this.loading.set(false);
        this.successMessage.set('Evento actualizado con éxito');
        
        setTimeout(() => {
          this.successMessage.set(null);
          this.router.navigate(['/events', id]); 
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        const message = err.error?.detail || 'Error al actualizar';
        this.error.set(message);
      }
    });
  }

  deleteEvent(id: number) {
    this.loading.set(true);
    this.eventService.deleteEvent(id).subscribe({
      next: () => {
        this.events.update(prev => prev.filter(e => e.id !== id));
        this.loading.set(false);
        this.successMessage.set('Evento eliminado correctamente');

        setTimeout(() => {
          this.successMessage.set(null);
          this.router.navigate(['/events']);
        }, 1000);
      },
      error: (err) => {
       this.loading.set(false);
        const message = err.error?.detail || 'No se pudo eliminar el evento';
        this.error.set(message);
        setTimeout(() => this.error.set(null), 5000);
      }
    });
  }
}