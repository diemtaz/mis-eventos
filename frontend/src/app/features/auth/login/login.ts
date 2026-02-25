import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { AuthStore } from '../../../core/store/auth-store';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { signal } from '@angular/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private authService = inject(AuthService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);


  email = '';
  password = '';
  loading = signal(false);
  error = signal<string>('');

  onSubmit() {
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          this.authStore.login({
            ...response.user,
            token: response.access_token
          });
          this.loading.set(false);
          const targetRoute = response.user.role === 'assistant' ? '/profile' : '/events';

          this.router.navigate([targetRoute]);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Credenciales incorrectas o error de servidor');
          }
      });
  }
}