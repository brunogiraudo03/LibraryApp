import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoanService } from '../../../services/loan/loan.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-loan-list',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './loan-list.component.html'
})
export class LoanListComponent implements OnInit {
    loanService = inject(LoanService);
    prestamos = this.loanService.prestamos;

    searchTerm = signal('');

    filteredLoans = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.prestamos();
        if (!term) return all;
        return all.filter(loan =>
            loan.libroTitulo?.toLowerCase().includes(term) ||
            loan.usuarioNombre?.toLowerCase().includes(term) ||
            loan.estado?.toLowerCase().includes(term) ||
            String(loan.id) === term
        );
    });

    ngOnInit() {
        this.loanService.getAllLoans();
    }

    returnBook(id: number) {
        if (confirm('¿Registrar devolución de este libro?')) {
            this.loanService.returnLoan(id).subscribe({
                next: () => {
                    // Success is visible immediately as item status changes
                },
                error: (err) => alert('Error: ' + (err.error?.message || 'No se pudo procesar la devolución'))
            });
        }
    }
}
