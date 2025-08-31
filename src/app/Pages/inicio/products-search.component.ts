import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { CategoryService } from '../../Services/category.service';
import { ProductService } from '../../Services/product.service';
import type { ICategory } from '../../Models/ICategory';
import type { IProductDto } from '../../Models/IProductDto';
import type { IPagedResult } from '../../Models/IPagedResult';
import { ConfirmService } from '../../Shared/confirm/confirm.service';

@Component({
  selector: 'app-products-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule, MatTableModule, MatPaginatorModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './products-search.component.html',
  styleUrls: ['./products-search.component.scss']
})
export class ProductsSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private confirm = inject(ConfirmService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filtros: FormGroup = this.fb.group({
    q: [''],
    categoryId: [null],
    minPrice: [null],
    maxPrice: [null]
  });

  displayedColumns: string[] = ['photo', 'name', 'category', 'price', 'stock', 'accion'];
  data: IProductDto[] = [];
  categorias: ICategory[] = [];
  total = 0;
  pageIndex = 0;
  pageSize = 50;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.categoryService.list().subscribe({
      next: cats => { this.categorias = cats ?? []; this.buscar(); },
      error: () => { this.categorias = []; this.buscar(); }
    });
  }

  buscar(): void {
    this.loading = true;
    this.error = null;
    const { q, categoryId, minPrice, maxPrice } = this.filtros.value;

    this.productService.search({
      page: this.pageIndex + 1,
      pageSize: this.pageSize,
      q: q || null,
      categoryId: categoryId ?? null,
      minPrice: minPrice ?? null,
      maxPrice: maxPrice ?? null
    }).subscribe({
      next: (res: IPagedResult<IProductDto> | any) => {
        this.data = res?.items ?? [];
        this.total = Number(res?.totalCount ?? res?.total ?? res?.count ?? 0);
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'No se pudo cargar la lista de productos.';
        this.loading = false;
      }
    });
  }

  limpiar(): void {
    this.filtros.reset({ q: '', categoryId: null, minPrice: null, maxPrice: null });
    this.pageIndex = 0;
    this.buscar();
  }

  onSubmit(): void {
    this.pageIndex = 0;
    this.buscar();
  }

  onPage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.buscar();
  }

  nuevo(): void {
    this.router.navigate(['/nuevo', 0]);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  editar(row: IProductDto): void {
    this.router.navigate(['/nuevo', row.id]);  }

  eliminar(row: IProductDto): void {
    this.confirm.open({
      title: 'Eliminar producto',
      message: `¿Desea eliminar el producto <strong>${row.name}</strong>?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    }).subscribe(ok => {
      if (!ok) return;
      this.productService.eliminar(row.id).subscribe(() => this.buscar());
    });
  }

  onImgError(ev: Event): void {
    (ev.target as HTMLImageElement).src = 'assets/no-image.png';
  }
}
