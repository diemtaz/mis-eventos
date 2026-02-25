import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventStore } from '@core/store/event-store';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth';
import { ConfirmModal }  from '../../../shared/components/confirm-modal/confirm-modal';
import { Event, EventStatus } from '@core/models/event.model';
@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, ConfirmModal],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.scss'
})
export class EventDetail implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router); 
  authStore = inject(AuthService); 
  store = inject(EventStore);

  showDeleteModal = signal(false);

  public readonly EventStatus = EventStatus;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.loadEventById(id);
  }

  ngOnDestroy(): void {
    this.store.clearSelectedEvent();
  }

  canEdit(): boolean {
    const role = this.authStore.user()?.role;
    return role === 'admin' || role === 'organizer';
  }
  onEdit(id: number): void {
    this.router.navigate(['/events', id, 'edit']);
  }

  onRegister(): void {
    const event = this.store.selectedEvent();
    if (!event) return;
    this.store.registerToEvent(event.id);
  }

  onDelete(): void {
    this.showDeleteModal.set(true); 
  }

  confirmDelete(confirmed: boolean, id: number): void {
    this.showDeleteModal.set(false);
    if (confirmed) {
      this.store.deleteEvent(id);
    }
  }

  isRegisterDisabled(event: Event): boolean {
    const status = event.status.toLowerCase();
    
    return this.store.loading() || 
          status === EventStatus.CANCELLED || 
          status === EventStatus.FULL;
  }

  getStatusLabel(status: string | EventStatus): string {
    const statusKey = String(status).toLowerCase();

    const labels: Record<string, string> = {
      ['published']: 'Evento Activo',
      ['full']: 'Evento Completo',
      ['cancelled']: 'Evento Cancelado'
    };

    return labels[statusKey] || 'Estado desconocido';
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}