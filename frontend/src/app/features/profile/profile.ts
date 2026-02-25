import { Component, inject, OnInit } from '@angular/core';
import { EventStore } from '@core/store/event-store';
import { CommonModule } from '@angular/common';
import { EventCard } from '@shared/components/event-card/event-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, EventCard, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {

  store = inject(EventStore);

  ngOnInit(): void {
    this.store.loadMyEvents();
  }
}