import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService, Libro } from '../../services/book/book.service';
import { AuthorService, Autor } from '../../services/author/author.service';
import { CategoryService, Categoria } from '../../services/category/category.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, NavbarComponent, SidebarComponent],
  templateUrl: './book-form.component.html',
  styles: []
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  authors = this.authorService.authors;
  categories = this.categoryService.categories;

  bookForm: FormGroup = this.fb.group({
    titulo: ['', [Validators.required]],
    isbn: ['', [Validators.required]],
    stock: [1, [Validators.required, Validators.min(0)]],
    estado: ['DISPONIBLE', [Validators.required]],
    autorId: [null, Validators.required],
    categoriaId: [null, Validators.required],
    imagenUrl: [''],
    descripcion: ['']
  });

  isEditMode = signal(false);
  bookId = signal<number | null>(null);
  errorMessage = signal('');

  ngOnInit(): void {
    // Ensure lists are loaded
    this.authorService.getAllAuthors().subscribe();
    this.categoryService.getAllCategories().subscribe();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookId.set(+id);
      this.isEditMode.set(true);
      this.loadBookData(+id);
    }
  }

  loadBookData(id: number) {
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          titulo: book.titulo,
          isbn: book.isbn,
          stock: book.stock,
          estado: book.estado,
          imagenUrl: book.imagenUrl,
          descripcion: book.descripcion,
          autorId: book.autorId,
          categoriaId: book.categoriaId
        });
      },
      error: (err) => {
        console.error('Error loading book', err);
        this.errorMessage.set('Error al cargar el libro.');
      }
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      // El backend espera DTO plano: { titulo, isbn, stock, autorId, categoriaId }
      // El form ya tiene esa estructura exacta.
      const bookData = this.bookForm.value;

      const request = this.isEditMode()
        ? this.bookService.updateBook(this.bookId()!, bookData)
        : this.bookService.createBook(bookData);

      request.subscribe({
        next: () => {
          this.router.navigate(['/manage-books']);
        },
        error: (err) => {
          console.error(err);
          const backendMsg = err.error?.message || err.message || 'Error desconocido';
          this.errorMessage.set(`No se pudo guardar: ${backendMsg}`);
        }
      });
    }
  }
}
