import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent],
    templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    isAdmin = this.authService.isAdmin;

    userForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        role: ['USER', [Validators.required]]
    });

    errorMessage = signal('');
    isEditMode = signal(false);
    userId = signal<number | null>(null);

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode.set(true);
                this.userId.set(+params['id']);
                // Remove password validation/requirement for edit if backend supports keeping it
                // ensuring password field is optional if not changing it:
                this.userForm.get('password')?.clearValidators();
                this.userForm.get('password')?.updateValueAndValidity();

                this.userService.getUserById(this.userId()!).subscribe({
                    next: (user) => {
                        this.userForm.patchValue({
                            nombre: user.nombre,
                            email: user.email,
                            role: user.role.replace('ROLE_', '')
                        });
                    },
                    error: (err) => this.errorMessage.set('Error al cargar usuario')
                });
            }
        });
    }

    isSubmitting = signal(false);

    onSubmit() {
        if (this.userForm.valid) {
            this.isSubmitting.set(true);
            const userData = this.userForm.value;

            const request = this.isEditMode()
                ? this.userService.updateUser(this.userId()!, userData)
                : this.userService.createUser(userData);

            request.subscribe({
                next: () => {
                    this.router.navigate(['/users']);
                    this.isSubmitting.set(false);
                },
                error: (err) => {
                    this.errorMessage.set(err.error?.message || 'Error al guardar usuario');
                    this.isSubmitting.set(false);
                }
            });
        }
    }
}
