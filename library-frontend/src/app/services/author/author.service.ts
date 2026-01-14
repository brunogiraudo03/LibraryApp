import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Autor {
    id?: number;
    nombre: string;
    nacionalidad?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private http = inject(HttpClient);
    authors = signal<Autor[]>([]);

    getAllAuthors(): Observable<Autor[]> {
        return this.http.get<Autor[]>('/api/autores').pipe(
            tap(authors => this.authors.set(authors))
        );
    }

    getAuthorById(id: number): Observable<Autor> {
        return this.http.get<Autor>(`/api/autores/${id}`);
    }

    createAuthor(author: Autor): Observable<Autor> {
        return this.http.post<Autor>('/api/autores', author).pipe(
            tap(() => this.refreshAuthors())
        );
    }

    updateAuthor(id: number, author: Autor): Observable<Autor> {
        return this.http.put<Autor>(`/api/autores/${id}`, author).pipe(
            tap(() => this.refreshAuthors())
        );
    }

    deleteAuthor(id: number): Observable<void> {
        return this.http.delete<void>(`/api/autores/${id}`).pipe(
            tap(() => this.refreshAuthors())
        );
    }

    private refreshAuthors() {
        this.getAllAuthors().subscribe();
    }
}
