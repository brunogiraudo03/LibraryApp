import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, RouterLink, SidebarComponent],
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    userService = inject(UserService);
    users = this.userService.users;
    searchTerm = signal('');

    filteredUsers = computed(() => {
        const term = this.searchTerm().toLowerCase();
        const all = this.users();
        if (!term) return all;
        return all.filter(u =>
            u.nombre.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.role.toLowerCase().includes(term)
        );
    });

    ngOnInit() {
        this.userService.getUsers().subscribe();
    }

    deleteUser(id: number) {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => { },
                error: (err) => alert('Error al eliminar usuario')
            });
        }
    }
}
