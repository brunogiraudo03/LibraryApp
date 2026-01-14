import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BookFormComponent } from './pages/book-form/book-form.component';
import { AuthorListComponent } from './pages/authors/author-list/author-list.component';
import { AuthorFormComponent } from './pages/authors/author-form/author-form.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { authGuard } from './guards/auth.guard';
import { BookListComponent } from './pages/books/book-list/book-list.component';
import { LoanListComponent } from './pages/loans/loan-list/loan-list.component';
import { LoanFormComponent } from './pages/loans/loan-form/loan-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Main Dashboard
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

    // Libros (Admin List)
    { path: 'manage-books', component: BookListComponent, canActivate: [authGuard] },
    { path: 'manage-books/new', component: BookFormComponent, canActivate: [authGuard] },
    { path: 'manage-books/edit/:id', component: BookFormComponent, canActivate: [authGuard] },

    // Préstamos
    { path: 'manage-loans', component: LoanListComponent, canActivate: [authGuard] },
    { path: 'manage-loans/new', component: LoanFormComponent, canActivate: [authGuard] },

    // Autores
    { path: 'authors', component: AuthorListComponent, canActivate: [authGuard] },
    { path: 'authors/new', component: AuthorFormComponent, canActivate: [authGuard] },
    { path: 'authors/edit/:id', component: AuthorFormComponent, canActivate: [authGuard] },

    // Categorías
    { path: 'categories', component: CategoryListComponent, canActivate: [authGuard] },
    { path: 'categories/new', component: CategoryFormComponent, canActivate: [authGuard] },
    { path: 'categories/edit/:id', component: CategoryFormComponent, canActivate: [authGuard] },

    // Usuarios
    { path: 'users', component: UserListComponent, canActivate: [authGuard] },
    { path: 'users/new', component: UserFormComponent, canActivate: [authGuard] },
    { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard] },

    // Fallback
    { path: '**', redirectTo: '/login' }
];
