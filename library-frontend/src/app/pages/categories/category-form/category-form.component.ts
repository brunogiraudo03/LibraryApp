import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService, Categoria } from '../../../services/category/category.service';
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';

@Component({
    selector: 'app-category-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarComponent],
    templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private categoryService = inject(CategoryService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    categoryForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required]],
        descripcion: ['']
    });

    isEditMode = signal(false);
    categoryId = signal<number | null>(null);

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode.set(true);
                this.categoryId.set(+params['id']);
                this.categoryService.getCategoryById(this.categoryId()!).subscribe(data => this.categoryForm.patchValue(data));
            }
        });
    }

    onSubmit() {
        if (this.categoryForm.valid) {
            const data: Categoria = this.categoryForm.value;
            const request = this.isEditMode()
                ? this.categoryService.updateCategory(this.categoryId()!, data)
                : this.categoryService.createCategory(data);

            request.subscribe(() => this.router.navigate(['/categories']));
        }
    }
}
