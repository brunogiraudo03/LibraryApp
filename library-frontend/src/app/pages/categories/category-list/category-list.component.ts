import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category/category.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
    categoryService = inject(CategoryService);
    categories = this.categoryService.categories;
    searchTerm = signal('');

    filteredCategories = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.categories();
        if (!term) return all;
        return all.filter(c =>
            c.nombre.toLowerCase().includes(term) ||
            c.descripcion?.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.categoryService.getAllCategories().subscribe();
    }

    deleteCategory(id: number) {
        if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
            this.categoryService.deleteCategory(id).subscribe({
                next: () => { },
                error: (err) => alert('Error al eliminar: ' + (err.error?.message || 'Puede tener libros asociados'))
            });
        }
    }
}
