import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;

  // Login State
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  loggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  /* ================= REGISTER ================= */

  register(data: {
    name: string;
    email: string;
    password: string;
    number: string;
  }) {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  /* ================= LOGIN ================= */

  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string; user: any }>(
      `${this.baseUrl}/login`,
      data
    );
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    this.loggedIn.next(true); // 🔥 Update UI
  }

  /* ================= TOKEN ================= */

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  /* ================= STATUS ================= */

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  /* ================= LOGOUT ================= */

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.loggedIn.next(false); // 🔥 Update UI
  }

  /* ================= USER ================= */

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  }
}
