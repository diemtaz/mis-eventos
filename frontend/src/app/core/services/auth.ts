import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponse, User } from '../models/user'; 
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/auth`;

  user = signal<User | null>(null);

  role = computed(() => this.user()?.role?.toLowerCase() || '');
  isLoggedIn = computed(() => !!this.user());

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.user.set(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      body.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).pipe(
      tap(response => {
        this.user.set(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.access_token);
      })
    );
  }

  register(email: string, password: string, role = 'ASSISTANT') {
    return this.http.post(`${environment.apiUrl}/auth/register`, { 
      email, 
      password, 
      role 
    });
  }

  logout() {
    this.user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}