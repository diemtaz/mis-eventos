import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user';



@Injectable({ providedIn: 'root' })
export class AuthStore {

  private _user = signal<(User & { token: string }) | null>(null);
  error = signal<string>('');

  user = computed(() => this._user());
  isLoggedIn = computed(() => !!this._user());
  role = computed(() => this._user()?.role);
  token = computed(() => this._user()?.token);

  login(user: User & { token: string }) {
    this._user.set(user);
    localStorage.setItem('auth', JSON.stringify(user));
  }

  logout() {
    this._user.set(null);
    localStorage.removeItem('auth');
  }

  loadFromStorage() {
    const data = localStorage.getItem('auth');
    if (data) {
      this._user.set(JSON.parse(data));
    }
  }
}