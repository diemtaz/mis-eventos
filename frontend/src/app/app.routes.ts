import { Routes } from '@angular/router';
import { authGuard } from '../app/core/guards/auth';
import { guestGuard } from '../app/core/guards/guest';

export const routes: Routes = [
  {
    path: 'register',
    canActivate: [guestGuard], 
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'auth/create-user',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/user-create/user-create').then(m => m.UserCreate)
  },
  {
    path: 'events',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/events/event-list/event-list')
        .then(m => m.EventList)
  },
  {
    path: 'events/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/events/event-form/event-form')
        .then(m => m.EventForm)
  },
  {
    path: 'events/:id/edit',
    canActivate: [authGuard],
    loadComponent: () => import('./features/events/event-form/event-form').then(m => m.EventForm)
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./features/events/event-detail/event-detail')
        .then(m => m.EventDetail)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile')
        .then(m => m.Profile)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];