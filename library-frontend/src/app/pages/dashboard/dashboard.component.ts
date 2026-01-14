import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService, Libro } from '../../services/book/book.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth/auth.service';
import { LoanService } from '../../services/loan/loan.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  template: `
    <!-- Layout Wrapper: Sidebar + Content -->
    <div class="flex min-h-screen bg-base-200/30">
      <!-- Sidebar Fixed -->
      <app-sidebar></app-sidebar>

      <!-- Main Content Area -->
      <main class="flex-1 ml-64 p-8">
        <div class="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 gap-4">
          <div>
            <h2 class="text-3xl font-extrabold text-base-content tracking-tight">Catálogo de Libros</h2>
            <p class="text-base-content/60 mt-1 font-medium">Explora nuestra colección premium</p>
          </div>
          
          <!-- Filters & Actions -->
          <div class="flex flex-col md:flex-row gap-3 w-full xl:w-auto items-center">
            
            <!-- Filter: Category -->
            <select class="select select-bordered w-full md:w-40 rounded-xl" [ngModel]="selectedCategory()" (ngModelChange)="selectedCategory.set($event)">
              <option value="">Todas las Categorías</option>
              @for (cat of uniqueCategories(); track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>

            <!-- Filter: Author -->
            <select class="select select-bordered w-full md:w-40 rounded-xl" [ngModel]="selectedAuthor()" (ngModelChange)="selectedAuthor.set($event)">
              <option value="">Todos los Autores</option>
              @for (auth of uniqueAuthors(); track auth) {
                <option [value]="auth">{{ auth }}</option>
              }
            </select>

            <!-- Search input -->
            <div class="form-control w-full md:w-60 relative group z-10">
              <div class="relative">
                <input type="text" 
                       placeholder="Buscar título..." 
                       class="input input-bordered w-full pl-10 pr-4 rounded-xl transition-all focus:w-full" 
                       [value]="searchTerm()" 
                       (input)="searchTerm.set($any($event.target).value)" />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/40">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            @if (isEmployee()) {
              <button (click)="createBook()" class="btn btn-primary shadow-lg shadow-primary/30 rounded-xl gap-2 font-bold px-6 whitespace-nowrap">
                + Nuevo Libro
              </button>
            }
          </div>
        </div>

        <!-- Loading & Error States -->
        <div *ngIf="loading()" class="flex flex-col items-center justify-center h-64 gap-4 opacity-50">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>

        <div *ngIf="!loading() && books().length === 0" class="flex flex-col items-center justify-center h-64 gap-3 animate-fade-in text-base-content/50">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
           </svg>
           <p class="font-bold text-lg">No se encontraron libros</p>
           <p class="text-sm">Si el sistema acaba de iniciar, espera unos segundos y recarga.</p>
           <button (click)="loadBooks()" class="btn btn-sm btn-outline mt-2 rounded-lg">Reintentar</button>
        </div>

        <!-- Grid -->
        <div *ngIf="!loading()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          @for (book of filteredBooks(); track book.id) {
            <div (click)="openBookDetails(book)" 
                 class="card bg-base-100 shadow-sm border border-base-200/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 glass cursor-pointer">
              
              <!-- Actions Overlay (Employee Only) -->
              @if (isEmployee()) {
                <div class="absolute top-2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2" (click)="$event.stopPropagation()">
                  <button (click)="editBook(book.id!)" class="btn btn-circle btn-sm btn-ghost bg-base-100/90 text-info shadow-sm" title="Editar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                  </button>
                  <button (click)="deleteBook(book.id!)" class="btn btn-circle btn-sm btn-ghost bg-base-100/90 text-error shadow-sm" title="Eliminar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
              }

              <figure class="px-0 relative h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
                @if (book.imagenUrl) {
                    <img [src]="book.imagenUrl" alt="Portada" 
                         class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                         [class.grayscale]="(book.stock || 0) <= 0 || book.estado === 'PRESTADO'"
                         onerror="this.onerror=null; this.src='https://placehold.co/400x600/e2e8f0/1e293b?text=Sin+Portada';" />
                } @else {
                    <div class="w-32 h-44 bg-white shadow-lg border-l-4 border-primary rounded-r flex items-center justify-center"
                         [class.grayscale]="(book.stock || 0) <= 0 || book.estado === 'PRESTADO'">
                        <span class="text-4xl grayscale opacity-50">📖</span>
                    </div>
                }
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                <div class="absolute bottom-2 left-2 badge border-none text-[10px] font-bold py-2 shadow-sm" [ngClass]="(book.stock || 0) > 0 ? 'bg-success/90 text-success-content' : 'bg-warning/90 text-warning-content'">
                  {{ (book.stock || 0) > 0 ? 'DISPONIBLE' : 'AGOTADO' }}
                </div>
              </figure>

              <div class="card-body p-4 pt-3 gap-1">
                <div class="text-xs uppercase tracking-wider font-bold opacity-50">{{ book.categoriaNombre || 'General' }}</div>
                <h2 class="card-title text-base font-bold leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors">
                  {{ book.titulo }}
                </h2>
                <div class="text-sm font-medium opacity-70">{{ book.autorNombre }}</div>
              </div>
            </div>
          }
        </div>
      </main>
    </div>

    <!-- Details Modal -->
    <dialog id="book_details_modal" class="modal modal-bottom sm:modal-middle backdrop-blur-sm">
      <div class="modal-box w-11/12 max-w-5xl p-0 overflow-hidden bg-base-100 rounded-3xl shadow-2xl relative">
        @if (selectedBook(); as book) {
          <div class="grid grid-cols-1 md:grid-cols-3 h-full max-h-[85vh] md:max-h-[700px]">
            <!-- Cover Image Side -->
            <div class="bg-base-200 relative h-64 md:h-full">
               @if (book.imagenUrl) {
                  <img [src]="book.imagenUrl" class="w-full h-full object-cover" 
                       [class.grayscale]="(book.stock || 0) <= 0 || book.estado === 'PRESTADO'"
                       onerror="this.onerror=null; this.src='https://placehold.co/400x600/e2e8f0/1e293b?text=Sin+Portada';" />
               } @else {
                  <div class="flex items-center justify-center h-full text-6xl" [class.grayscale]="(book.stock || 0) <= 0 || book.estado === 'PRESTADO'">📖</div>
               }
               <div class="absolute inset-0 bg-gradient-to-t from-base-100 md:bg-gradient-to-r md:from-transparent md:to-base-100 opacity-50"></div>
            </div>

            <!-- Content Side -->
            <div class="col-span-2 p-10 overflow-y-auto">
               <div class="flex items-center gap-2 mb-2">
                 <span class="badge badge-primary badge-outline font-bold tracking-wider text-xs">{{ book.categoriaNombre || 'SIN CATEGORÍA' }}</span>
                 <span class="text-xs font-bold opacity-40 uppercase tracking-widest">|</span>
                 <span class="text-xs font-bold opacity-60 uppercase tracking-widest">{{ book.autorNombre || 'AUTOR DESCONOCIDO' }}</span>
               </div>
               
               <h3 class="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">{{ book.titulo }}</h3>

               <div class="flex flex-wrap gap-3 mb-8">
                 <div class="badge badge-lg py-4 px-4" [ngClass]="(book.stock || 0) > 0 ? 'badge-success gap-2' : 'badge-warning gap-2'">
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                    <span class="font-bold text-white">{{ (book.stock || 0) > 0 ? 'Disponible' : 'Agotado' }}</span>
                 </div>
                 <div class="badge badge-lg badge-ghost gap-2 font-mono py-4">
                    ISBN: {{ book.isbn }}
                 </div>
                 @if((book.stock || 0) > 0) {
                    <div class="badge badge-lg badge-neutral gap-2 py-4">
                       Stock: {{ book.stock }}
                    </div>
                 }
               </div>

               <div class="prose max-w-none mb-8">
                 <h4 class="text-lg font-bold mb-2 opacity-90 border-b border-base-300 pb-2">Sinopsis</h4>
                 <p class="text-lg leading-relaxed opacity-80 whitespace-pre-line text-justify">
                   {{ book.descripcion || 'No hay descripción disponible para este libro.' }}
                 </p>
               </div>

               <!-- Modal Actions -->
               <div class="modal-action mt-auto flex justify-end gap-3 pt-6 border-t border-base-200">
                 @if (isEmployee() && (book.stock || 0) > 0) {
                   <button (click)="goToRequest(book.id!)" class="btn btn-primary btn-lg rounded-xl px-8 shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                     Solicitar Préstamo
                   </button>
                 }
                 <form method="dialog">
                   <button class="btn btn-ghost btn-lg rounded-xl">Cerrar</button>
                 </form>
               </div>
            </div>
            
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
          </div>
        }
      </div>
    </dialog>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  bookService = inject(BookService);
  authService = inject(AuthService);
  loanService = inject(LoanService);
  router = inject(Router);

  books = this.bookService.books;
  isEmployee = this.authService.isEmployee; // Computed signal
  loading = signal<boolean>(true);

  // Filters (Signals for reactivity)
  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  selectedAuthor = signal<string>('');

  // Modal
  selectedBook = signal<Libro | null>(null);

  // Computed Lists for Filter Dropdowns
  uniqueCategories = computed(() => {
    const cats = new Set(this.books().map(b => b.categoriaNombre || b.nombreCategoria || ''));
    cats.delete('');
    return Array.from(cats).sort();
  });

  uniqueAuthors = computed(() => {
    const auths = new Set(this.books().map(b => b.autorNombre || b.nombreAutor || ''));
    auths.delete('');
    return Array.from(auths).sort();
  });

  // Filtered Books
  filteredBooks = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const cat = this.selectedCategory();
    const auth = this.selectedAuthor();

    return this.books().filter(b => {
      const matchTerm = (b.titulo?.toLowerCase().includes(term) || b.isbn?.toLowerCase().includes(term));
      const matchCat = cat ? (b.categoriaNombre === cat || b.nombreCategoria === cat) : true;
      const matchAuth = auth ? (b.autorNombre === auth || b.nombreAutor === auth) : true;
      return matchTerm && matchCat && matchAuth;
    });
  });

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.loading.set(true);
    this.bookService.getAllBooks().subscribe({
      next: () => this.loading.set(false),
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  createBook() {
    this.router.navigate(['/manage-books/new']);
  }

  editBook(id: number) {
    this.router.navigate(['/manage-books/edit', id]);
  }

  deleteBook(id: number) {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      this.bookService.deleteBook(id).subscribe({
        next: () => this.loadBooks(),
        error: (err) => alert('Error al eliminar libro')
      });
    }
  }

  openBookDetails(book: Libro) {
    this.selectedBook.set(book);
    const modal = document.getElementById('book_details_modal') as HTMLDialogElement;
    if (modal) modal.showModal();
  }

  closeModal() {
    const modal = document.getElementById('book_details_modal') as HTMLDialogElement;
    if (modal) modal.close();
  }

  goToRequest(bookId: number) {
    // Redirect to Loan Form with Book ID pre-filled (requires implementation in LoanForm)
    // For now, simple redirect.
    this.router.navigate(['/manage-loans/new'], { queryParams: { bookId: bookId } });
  }
}
