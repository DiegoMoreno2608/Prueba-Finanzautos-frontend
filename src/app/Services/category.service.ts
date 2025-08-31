import { ICategory } from './../Models/ICategory';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appSettings } from '../Settings/appsettings';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = appSettings.apiUrl;

  list(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.apiUrl}Category`);
  }
}
