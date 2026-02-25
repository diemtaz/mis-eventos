import { Component, inject, OnInit, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventStore } from '@core/store/event-store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.html',
  styleUrl: './event-form.scss'
})
export class EventForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  store = inject(EventStore);

  eventForm: FormGroup;
  isEditMode = false;
  eventId: number | null = null;

  constructor() {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required]],
      speaker_name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
      status: ['published', [Validators.required]]
    });

    effect(() => {
      const event = this.store.selectedEvent();
      if (event && this.isEditMode) {
        const startDate = new Date(event.start_date).toISOString().slice(0, 16);
        const endDate = new Date(event.end_date).toISOString().slice(0, 16);

        this.eventForm.patchValue({
          ...event,
          start_date: startDate,
          end_date: endDate,
          status: event.status.toUpperCase()
        });
      }
    });
  }

  get backButtonText(): string {
    return this.isEditMode ? 'Volver al Detalle' : 'Volver al Listado';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = Number(id);
      this.store.loadEventById(this.eventId);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      if (this.isEditMode && this.eventId) {
        this.store.updateEvent(this.eventId, formData);
      } else {
        this.store.createEvent(formData);
      }
    }
  }
  goBack(): void {
    if (this.isEditMode && this.eventId) {
      this.router.navigate(['/events', this.eventId]);
    } else {
      this.router.navigate(['/events']);
    }
  }
}