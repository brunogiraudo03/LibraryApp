import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Prestamo {
    id: number;
    usuarioNombre?: string;
    libroTitulo?: string;
    fechaPrestamo: string;
    fechaDevolucion: string;
    estado: 'ACTIVO' | 'DEVUELTO' | 'VENCIDO';
}

export interface PrestamoRequest {
    usuarioId: number;
    libroId: number;
    diasPrestamo: number;
}

@Injectable({
    providedIn: 'root'
})
export class LoanService {
    private http = inject(HttpClient);
    private apiUrl = '/api/prestamos';

    prestamos = signal<Prestamo[]>([]);

    getAllLoans(usuarioId?: number) {
        let params = new HttpParams();
        if (usuarioId) params = params.set('usuarioId', usuarioId);

        this.http.get<Prestamo[]>(this.apiUrl, { params }).subscribe({
            next: (data) => this.prestamos.set(data),
            error: (err) => console.error('Error loading loans', err)
        });
    }

    createLoan(data: PrestamoRequest): Observable<any> {
        return this.http.post(this.apiUrl, data).pipe(
            tap(() => this.getAllLoans())
        );
    }

    getLoanById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    returnLoan(id: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/devolucion`, {}).pipe(
            tap(() => this.getAllLoans())
        );
    }
}
