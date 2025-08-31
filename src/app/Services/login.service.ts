import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { appSettings } from '../Settings/appsettings';
import { ILogin } from '../Models/ILogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
private http = inject(HttpClient)
  private apiUrl = appSettings.apiUrl;
  constructor() { }

  login(data: { username: string, password: string }) {
    return this.http.post<ILogin>(`${this.apiUrl}Auth/login`, data);
  }

}
