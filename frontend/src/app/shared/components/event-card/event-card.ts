import { Component, input } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Event } from '@core/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.scss'
})
export class EventCard {
  event = input.required<Event>(); 
}