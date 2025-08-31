
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductSearchParams } from '../Models/IProductSearchParams';
import { appSettings } from '../Settings/appsettings';
import type { IPagedResult } from '../Models/IPagedResult';
import type { IProductDto } from '../Models/IProductDto';
import { ICreateProductDto } from '../Models/ICreateProductDto';



@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = appSettings.apiUrl;

  search(params: ProductSearchParams): Observable<IPagedResult<IProductDto>> {
    let httpParams = new HttpParams()
      .set('page', params.page)
      .set('pageSize', params.pageSize);
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.categoryId != null) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.minPrice != null) httpParams = httpParams.set('minPrice', params.minPrice);
    if (params.maxPrice != null) httpParams = httpParams.set('maxPrice', params.maxPrice);

    return this.http.get<IPagedResult<IProductDto>>(`${this.apiUrl}Products`, { params: httpParams });
  }
  eliminar(id: number) {
    return this.http.delete<boolean>(`${this.apiUrl}Products/${id}`);
  }
  create(objeto: ICreateProductDto) {
    return this.http.post<ICreateProductDto>(`${this.apiUrl}Products`, objeto);
  }
  getById(id: number) {
    return this.http.get<IProductDto>(`${this.apiUrl}Products/${id}`);
  }
update(id: number, dto: ICreateProductDto) { return this.http.put<any>(`${this.apiUrl}Products/${id}`, dto); }

}
