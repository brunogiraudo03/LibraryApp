import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthorService, Autor } from '../../../services/author/author.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-author-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent],
    templateUrl: './author-form.component.html'
})
export class AuthorFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authorService = inject(AuthorService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    authorForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required]],
        nacionalidad: ['']
    });

    isEditMode = signal(false);
    authorId = signal<number | null>(null);

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode.set(true);
                this.authorId.set(+params['id']);
                this.authorService.getAuthorById(this.authorId()!).subscribe(data => this.authorForm.patchValue(data));
            }
        });
    }

    onSubmit() {
        if (this.authorForm.valid) {
            const data: Autor = this.authorForm.value;
            const request = this.isEditMode()
                ? this.authorService.updateAuthor(this.authorId()!, data)
                : this.authorService.createAuthor(data);

            request.subscribe(() => this.router.navigate(['/authors']));
        }
    }
}
