import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthStore } from './core/store/auth-store';
import { provideRouter } from '@angular/router';

describe('App', () => {
  const authStoreMock = {
    isLoggedIn: () => true,
    role: () => 'admin',
    loadFromStorage: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]), 
        { provide: AuthStore, useValue: authStoreMock }
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const titleText = compiled.querySelector('.nav-brand h1')?.textContent ?? '';
    
    expect(titleText).toContain('Mis Eventos');
  });
});