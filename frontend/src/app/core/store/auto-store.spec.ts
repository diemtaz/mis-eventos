import { TestBed } from '@angular/core/testing';
import { AuthStore } from './auth-store';
import { User } from '../models/user';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('AuthStore', () => {
  let store: AuthStore;
  const mockUser: User & { token: string } = {
    id: 1,
    email: 'test@test.com',
    role: 'admin',
    token: 'fake-jwt-token'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const localStorageMock = (() => {
      let store: Record<string, string> = {};
      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
        removeItem: vi.fn((key: string) => { delete store[key]; }),
        clear: vi.fn(() => { store = {}; })
      };
    })();

    vi.stubGlobal('localStorage', localStorageMock);

    TestBed.configureTestingModule({
      providers: [AuthStore]
    });
    store = TestBed.inject(AuthStore);
  });

  it('debe iniciar con estado inicial nulo', () => {
    expect(store.user()).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
    expect(store.role()).toBeUndefined();
  });

  it('debe hacer login, guardar en localStorage y actualizar estado', () => {
    store.login(mockUser);

    expect(store.user()).toEqual(mockUser);
    expect(store.isLoggedIn()).toBe(true);
    expect(store.token()).toBe('fake-jwt-token');
    expect(store.role()).toBe('admin');
    expect(localStorage.setItem).toHaveBeenCalledWith('auth', JSON.stringify(mockUser));
  });

  it('debe hacer logout y limpiar localStorage', () => {
    store.login(mockUser);
    store.logout();

    expect(store.user()).toBeNull();
    expect(store.isLoggedIn()).toBe(false);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth');
  });

  it('debe cargar datos desde storage si existen', () => {

    localStorage.setItem('auth', JSON.stringify(mockUser));
    
    store.loadFromStorage();

    expect(store.user()).toEqual(mockUser);
    expect(store.isLoggedIn()).toBe(true);
  });

  it('no debe cargar nada si storage está vacío', () => {
    store.loadFromStorage();
    expect(store.user()).toBeNull();
  });
});