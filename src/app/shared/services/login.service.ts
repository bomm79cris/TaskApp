import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rutas } from '../../enviroment/enviroment.urls';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(this.getCurrentUserFromLocalStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getCurrentUserFromLocalStorage() {
    if (typeof window !== 'undefined' && localStorage) {
      return JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
    return {};
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${Rutas.UrlApi}/api/Auth/login`, { email, password })
      .pipe(
        map(response => {
          if (response.token) {
            if (typeof window !== 'undefined' && localStorage) {
              localStorage.setItem('token', response.token);
            }
            this.currentUserSubject.next(response.user);
          }
          return response;
        })
      );
  }

  logout() {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn() {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  getUserFromToken() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const decodedToken = jwtDecode<any>(token);
      return decodedToken;
    }
    return null;
  }
}
