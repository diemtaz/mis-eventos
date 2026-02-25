import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore } from './core/store/auth-store';
import { EventStore } from './core/store/event-store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  public auth = inject(AuthStore);
  private router = inject(Router);
  private eventStore = inject(EventStore); 

  constructor() {
    this.auth.loadFromStorage();
    if (this.auth.isLoggedIn()) {
      this.eventStore.loadMyEvents();
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}