import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent],
  template: `
    <div class="navbar bg-base-100/95 backdrop-blur-md shadow-sm border-b border-base-content/5 px-4 sticky top-0 z-50 transition-all duration-300">
      <div class="flex-none">
        <app-theme-toggle></app-theme-toggle>
      </div>
      <div class="flex-1 ml-2">
        <a routerLink="/dashboard" class="btn btn-ghost text-xl text-primary font-bold tracking-tight hover:bg-transparent">
          <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Library</span> System
        </a>
      </div>
      <div class="flex-none gap-2">
        <!-- Menú exclusivo Admin/Empleado -->
        @if (authService.isEmployee()) {
          <ul class="menu menu-horizontal px-1 hidden lg:flex gap-1">
             <li><a routerLink="/manage-books" routerLinkActive="active font-bold text-primary" class="rounded-lg font-medium text-base-content/70 hover:text-primary hover:bg-primary/10 transition-all">Libros</a></li>
             <li><a routerLink="/manage-loans" routerLinkActive="active font-bold text-primary" class="rounded-lg font-medium text-base-content/70 hover:text-primary hover:bg-primary/10 transition-all">Préstamos</a></li>
          </ul>
        }

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar ring ring-primary/20 ring-offset-2 ring-offset-base-100 hover:ring-primary/40 transition-all">
            <div class="w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
               <span class="text-lg font-bold">{{ getUserInitial() }}</span>
            </div>
          </div>
          <ul tabindex="0" class="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-content/10">
            <li class="menu-title px-4 py-2 text-xs font-bold text-base-content/50 border-b border-base-content/5 mb-2">Cuenta</li>
            <li><a (click)="logout()" class="text-error hover:bg-error/10 hover:text-error-focus font-medium">Cerrar Sesión</a></li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  // Computed signal o getter para rol
  user = this.authService.currentUser;

  getUserInitial(): string {
    return this.user()?.sub?.charAt(0).toUpperCase() || 'U';
  }

  logout() {
    this.authService.logout();
  }
}
