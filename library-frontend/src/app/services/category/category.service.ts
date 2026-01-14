import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Categoria {
    id?: number;
    nombre: string;
    descripcion?: string;
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private http = inject(HttpClient);
    categories = signal<Categoria[]>([]);

    getAllCategories(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>('/api/categorias').pipe(
            tap(categories => this.categories.set(categories))
        );
    }

    getCategoryById(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`/api/categorias/${id}`);
    }

    createCategory(category: Categoria): Observable<Categoria> {
        return this.http.post<Categoria>('/api/categorias', category).pipe(
            tap(() => this.refreshCategories())
        );
    }

    updateCategory(id: number, category: Categoria): Observable<Categoria> {
        return this.http.put<Categoria>(`/api/categorias/${id}`, category).pipe(
            tap(() => this.refreshCategories())
        );
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`/api/categorias/${id}`).pipe(
            tap(() => this.refreshCategories())
        );
    }

    private refreshCategories() {
        this.getAllCategories().subscribe();
    }
}
