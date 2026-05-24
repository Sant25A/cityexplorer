import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);

  // Signal reactiva que contiene el objeto del usuario o null si no inició sesión
  currentUser = signal<any>(this.getInitialUser());

  // Signal computada que detectará automáticamente si el usuario es administrador
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  private getInitialUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  login(data: { email: string; password: string }) {
    return this.api.post('auth/login', data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // Actualizamos la Signal global con los nuevos datos (incluye el rol)
        this.currentUser.set(res.user);
      }),
    );
  }

  register(data: { username: string; email: string; password: string }) {
    return this.api.post('auth/register', data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Reseteamos la Signal al cerrar sesión
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}