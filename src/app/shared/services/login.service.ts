import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    //Utilizo un get para mockear el response del login y que me regrese un token mockeado
    return this.http.get<any>(`https://dummyjson.com/c/c779-6c8a-4b5a-a459`)
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
