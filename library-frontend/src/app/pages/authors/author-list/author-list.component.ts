import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthorService } from '../../../services/author/author.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-author-list',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './author-list.component.html'
})
export class AuthorListComponent implements OnInit {
    authorService = inject(AuthorService);
    authors = this.authorService.authors;
    searchTerm = signal('');

    filteredAuthors = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.authors();
        if (!term) return all;
        return all.filter(a =>
            a.nombre.toLowerCase().includes(term) ||
            a.nacionalidad?.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.authorService.getAllAuthors().subscribe();
    }

    deleteAuthor(id: number) {
        if (confirm('¿Seguro que deseas eliminar este autor?')) {
            this.authorService.deleteAuthor(id).subscribe({
                next: () => { },
                error: (err) => alert('Error al eliminar: ' + (err.error?.message || 'Puede tener libros asociados'))
            });
        }
    }
}
