import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventCard } from '../../../shared/components/event-card/event-card'; 
import { EventStore } from '@core/store/event-store';
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, EventCard],
  templateUrl: './event-list.html',
  styleUrl: './event-list.scss'
})
export class EventList implements OnInit {

  store = inject(EventStore);
  protected readonly Math = Math;

  ngOnInit(): void {
    this.store.loadEvents();
  }
}