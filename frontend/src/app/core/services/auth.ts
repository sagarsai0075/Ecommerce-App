import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;

  // Login State
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<any | null>(null);
  private meRequest$: Observable<any> | null = null;

  loggedIn$ = this.loggedIn.asObservable();
  currentUser$ = this.currentUser.asObservable();

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
    ).pipe(
      tap(response => {
        if (response?.user) {
          this.setCurrentUser(response.user);
        }
      })
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
    this.setCurrentUser(null);

    this.loggedIn.next(false); // 🔥 Update UI
  }

  /* ================= USER ================= */

  setCurrentUser(user: any | null) {
    this.currentUser.next(user);
  }

  getUser() {
    return this.currentUser.value;
  }

  getMe() {
    return this.http.get(`${this.baseUrl}/me`).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  ensureUserLoaded() {
    const cached = this.getUser();
    if (cached) {
      return of(cached);
    }

    if (this.meRequest$) {
      return this.meRequest$;
    }

    this.meRequest$ = this.http.get(`${this.baseUrl}/me`).pipe(
      tap(user => this.setCurrentUser(user)),
      shareReplay(1),
      finalize(() => {
        this.meRequest$ = null;
      })
    );

    return this.meRequest$;
  }

  updateProfile(data: any) {
    return this.http.put(`${this.baseUrl}/profile`, data).pipe(
      tap(user => this.setCurrentUser(user))
    );
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword
    });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

  isAdmin(): boolean {
    const user = this.getUser();
    if (user?.role) {
      return user.role === 'admin';
    }

    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = this.decodeToken(token);
    return payload?.role === 'admin';
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}
