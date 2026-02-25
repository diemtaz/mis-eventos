import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-create.html',
  styleUrl: '../login/login.scss' 
})
export class UserCreate {
  email = '';
  password = '';
  role = 'ASSISTANT'; 
  loading = signal(false);
  error = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    this.loading.set(true);
    this.authService.register(this.email, this.password, this.role).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.detail || 'Error al crear la cuenta');
      }
    });
  }
}