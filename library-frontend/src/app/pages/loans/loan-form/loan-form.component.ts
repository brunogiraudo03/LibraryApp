import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoanService } from '../../../services/loan/loan.service';
import { BookService } from '../../../services/book/book.service';
import { UserService } from '../../../services/user/user.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-loan-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent],
    templateUrl: './loan-form.component.html'
})
export class LoanFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private loanService = inject(LoanService);
    private bookService = inject(BookService);
    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    users = this.userService.users;
    books = this.bookService.books;

    form = this.fb.group({
        usuarioId: ['', [Validators.required]],
        libroId: ['', [Validators.required]],
        diasPrestamo: [7, [Validators.required, Validators.min(1)]]
    });

    errorMessage = '';
    isSubmitting = signal(false);

    ngOnInit() {
        this.userService.getUsers().subscribe();
        this.bookService.getAllBooks().subscribe(() => {
            // Pre-select book if query param exists
            this.route.queryParams.subscribe(params => {
                if (params['bookId']) {
                    this.form.patchValue({ libroId: params['bookId'] });
                }
            });
        });
    }

    onSubmit() {
        if (this.form.valid) {
            this.isSubmitting.set(true);
            this.loanService.createLoan(this.form.value as any).subscribe({
                next: () => {
                    this.router.navigate(['/manage-loans']);
                    this.isSubmitting.set(false);
                },
                error: (err) => {
                    console.error(err);
                    this.errorMessage = err.error?.message || 'Error al registrar el préstamo';
                    this.isSubmitting.set(false);
                }
            });
        }
    }
}
