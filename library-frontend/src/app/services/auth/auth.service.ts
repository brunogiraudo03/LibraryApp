import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

// Simple JWT decoder (para no añadir librerías pesadas)
function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Guardamos el payload decodificado del token
  currentUser = signal<any>(null);

  // Helpers de roles
  isAdmin = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  });

  isEmployee = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'EMPLEADO' || role === 'ROLE_EMPLEADO' || role === 'ADMIN' || role === 'ROLE_ADMIN';
  });

  constructor() {
    this.checkToken();
  }

  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = parseJwt(token);
        // Mapeamos roles si spring los devuelve como authorities o scope
        // Spring suele poner roles en "roles" o "authorities"
        // Ajustaremos según lo que veamos en el token real.
        // Por ahora guardamos todo el decoded.
        this.currentUser.set({ ...decoded, token });
      } catch (e) {
        console.error('Invalid token');
        this.logout();
      }
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Signal to expose login errors to UI components
  loginError = signal<string>('');

  login(credentials: any): Observable<any> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap({
        next: response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.checkToken(); // Actualiza el signal
            this.router.navigate(['/dashboard']);
            this.loginError.set(''); // clear previous errors
          }
        },
        error: err => {
          console.error(err);
          // Backend may send err.error.message; fallback to generic text
          const msg = err.error?.message || 'Credenciales inválidas';
          this.loginError.set(msg);
        }
      })
    );
  }

  // Signal to expose registration errors to UI components
  registerError = signal<string>('');

  register(data: any): Observable<any> {
    return this.http.post<any>('/api/auth/register', data).pipe(
      tap({
        error: err => {
          console.error(err);
          const msg = err.error?.message || 'Error al registrarse. Intente nuevamente.';
          this.registerError.set(msg);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
