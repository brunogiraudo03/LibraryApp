import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  registerForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Expose backend registration error via AuthService signal
  // No local errorMessage needed; use authService.registerError()

  onSubmit() {
    if (this.registerForm.valid) {
      const payload = { ...this.registerForm.value, role: 'USER' };
      this.authService.register(payload).subscribe({
        next: () => this.router.navigate(['/login']),
        // Errors are handled by AuthService.registerError signal
        error: () => { }
      });
    }
  }
}
