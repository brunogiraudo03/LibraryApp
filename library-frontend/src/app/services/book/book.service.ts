import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Libro {
  id?: number;
  titulo: string;
  isbn: string;
  fechaPublicacion?: string;
  estado?: string; // DISPONIBLE, PRESTADO
  autorId?: number;
  categoriaId?: number;
  autorNombre?: string;     // Backend DTO
  categoriaNombre?: string; // Backend DTO
  nombreAutor?: string;     // Previous fallback elsewhere
  nombreCategoria?: string; // Previous fallback elsewhere
  stock?: number;
  imagenUrl?: string;
  descripcion?: string; // Nuevo campo
  // Relaciones completas (si backend las devuelve)
  autor?: any;
  categoria?: any;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);

  // State management simple con Signals
  books = signal<Libro[]>([]);

  getAllBooks(): Observable<Libro[]> {
    return this.http.get<Libro[]>('/api/libros').pipe(
      tap(books => this.books.set(books))
    );
  }

  getBookById(id: number): Observable<Libro> {
    return this.http.get<Libro>(`/api/libros/${id}`);
  }

  createBook(book: Libro): Observable<Libro> {
    return this.http.post<Libro>('/api/libros', book).pipe(
      tap(() => this.refreshBooks())
    );
  }

  updateBook(id: number, book: Libro): Observable<Libro> {
    return this.http.put<Libro>(`/api/libros/${id}`, book).pipe(
      tap(() => this.refreshBooks())
    );
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`/api/libros/${id}`).pipe(
      tap(() => this.refreshBooks())
    );
  }

  private refreshBooks() {
    this.getAllBooks().subscribe();
  }
}
