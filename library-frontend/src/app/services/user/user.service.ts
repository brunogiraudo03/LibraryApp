import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);

    users = signal<any[]>([]);

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>('/api/usuarios').pipe(
            tap(users => this.users.set(users))
        );
    }

    getUserById(id: number): Observable<any> {
        return this.http.get<any>(`/api/usuarios/${id}`);
    }

    updateUser(id: number, user: any): Observable<any> {
        return this.http.put<any>(`/api/usuarios/${id}`, user).pipe(
            tap(() => this.getUsers().subscribe())
        );
    }

    createUser(user: any): Observable<any> {
        return this.http.post<any>('/api/usuarios', user).pipe(
            tap(() => this.getUsers().subscribe())
        );
    }

    deleteUser(id: number): Observable<void> {
        return this.http.delete<void>(`/api/usuarios/${id}`).pipe(
            tap(() => this.getUsers().subscribe())
        );
    }
}
