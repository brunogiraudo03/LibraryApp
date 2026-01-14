import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService, Libro } from '../../../services/book/book.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-book-list',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
    bookService = inject(BookService);
    books = this.bookService.books;

    searchTerm = signal('');

    filteredBooks = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.books();
        if (!term) return all;
        return all.filter(book =>
            book.titulo?.toLowerCase().includes(term) ||
            book.isbn?.toLowerCase().includes(term) ||
            book.autorNombre?.toLowerCase().includes(term) ||
            book.categoriaNombre?.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.bookService.getAllBooks().subscribe();
    }

    deleteBook(book: Libro) {
        if (confirm(`¿Estás seguro de eliminar el libro "${book.titulo}"?`)) {
            if (book.id) {
                this.bookService.deleteBook(book.id).subscribe({
                    next: () => { },
                    error: (err) => alert('Error al eliminar libro')
                })
            }
        }
    }
}
