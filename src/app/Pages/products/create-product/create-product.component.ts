import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';

import { CategoryService } from '../../../Services/category.service';
import { ProductService } from '../../../Services/product.service';
import type { ICreateProductDto } from '../../../Models/ICreateProductDto';
import { ICategory } from '../../../Models/ICategory';
import { IProductDto } from '../../../Models/IProductDto';

function noWhitespace(c: AbstractControl): ValidationErrors | null {
  const v = (c.value ?? '').toString();
  return v.trim().length ? null : { whitespace: true };
}

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  isEdit = false;
  productId: number | null = null;

  categorias: ICategory[] = [];
  selectedCategory: ICategory | null = null;

  loading = false;
  error: string | null = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80), noWhitespace]],
    categoryId: [null as number | null, [Validators.required]],
    price: [0 as number, [Validators.required, Validators.min(0), Validators.max(1_000_000)]],
    stock: [0 as number, [Validators.required, Validators.min(0), Validators.max(1_000_000)]],
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.productId = Number(idParam);
    }

    this.categoryService.list().subscribe({
      next: (cats) => {
        this.categorias = cats ?? [];
        this.form.get('categoryId')?.valueChanges.subscribe((id) => {
          this.selectedCategory = this.categorias.find(c => c.id === Number(id)) ?? null;
        });

        if (this.isEdit && this.productId) this.loadProduct(this.productId);
      },
      error: () => {
        this.categorias = [];
        if (this.isEdit && this.productId) this.loadProduct(this.productId);
      }
    });
  }

private loadProduct(id: number): void {
  this.loading = true;
  this.productService.getById(id)
    .pipe(finalize(() => (this.loading = false)))
    .subscribe({
      next: (p: IProductDto) => {
        const found = this.categorias.find(c => c.name === p.category); // mapear por nombre
        this.form.patchValue({
          name: p.name,
          price: p.price,
          stock: p.stock,
          categoryId: found?.id ?? null
        });
        this.selectedCategory = found ?? null;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el producto.';
        console.error(err);
      }
    });
}

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;

    this.error = null;
    this.loading = true;

    const v = this.form.value;
    const dto: ICreateProductDto = {
      name: String(v.name ?? '').trim(),
      categoryId: Number(v.categoryId),
      price: Number(v.price),
      stock: Number(v.stock),
    };

    const obs = this.isEdit && this.productId
      ? this.productService.update(this.productId, dto)
      : this.productService.create(dto);

    obs.pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: (err) => {
        this.error = err?.status === 401
          ? 'Sesión caducada o no autorizada.'
          : (this.isEdit ? 'No se pudo actualizar el producto.' : 'No se pudo crear el producto.');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/inicio']);
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/no-image.png';
  }
}
