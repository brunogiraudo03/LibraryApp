import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button (click)="toggleTheme()" class="btn btn-ghost btn-circle" aria-label="Cambiar modo oscuro">
      <svg *ngIf="!isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.364 5.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 000 14a7 7 0 000-14z" />
      </svg>
      <svg *ngIf="isDark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
      </svg>
    </button>
  `,
    styles: []
})
export class ThemeToggleComponent {
    private readonly storageKey = 'theme';
    isDark = false;

    constructor() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.isDark = saved === 'dark';
            this.applyTheme();
        } else {
            // Detect system preference
            this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.applyTheme();
        }
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        localStorage.setItem(this.storageKey, this.isDark ? 'dark' : 'light');
        this.applyTheme();
    }

    private applyTheme() {
        const html = document.documentElement;
        if (this.isDark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
}
