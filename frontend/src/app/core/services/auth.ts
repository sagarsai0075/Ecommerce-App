import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;
  private readonly userStorageKey = 'currentUser';

  // Login State
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUser = new BehaviorSubject<any | null>(this.getInitialUser());
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

  return this.http.post<{ token: string; user: any }>(
    `${this.baseUrl}/register`,
    data
  ).pipe(

    tap(response => {

      // ✅ Save token
      if (response?.token) {
        this.saveToken(response.token);
      }

      // ✅ Save user
      if (response?.user) {
        this.setCurrentUser(response.user);
      }

    })
  );
}

  /* ================= LOGIN ================= */

 login(data: { email: string; password: string }) {

  return this.http.post<{ token: string; user: any }>(
    `${this.baseUrl}/login`,
    data
  ).pipe(

    tap(response => {

      // ✅ Save token
      if (response?.token) {
        this.saveToken(response.token);
      }

      // ✅ Save user
      if (response?.user) {
        this.setCurrentUser(response.user);
      }

    })
  );
}
  saveToken(token: string) {
    localStorage.setItem('token', token);
    if (!this.getUser()) {
      const payload = this.decodeToken(token);
      if (payload) {
        this.setCurrentUser(payload);
      }
    }
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
    localStorage.removeItem(this.userStorageKey);
    this.setCurrentUser(null);

    this.loggedIn.next(false); // 🔥 Update UI
  }

  /* ================= USER ================= */

  setCurrentUser(user: any | null) {
    if (user) {
      localStorage.setItem(this.userStorageKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.userStorageKey);
    }

    this.currentUser.next(user);
  }

  getUser() {
    return this.currentUser.value;
  }

  getMe() {
    return this.http.get(`${this.baseUrl}/me`).pipe(
      timeout(10000),
      catchError((error) => throwError(() => error)),
      tap(user => this.setCurrentUser(user))
    );
  }

  ensureUserLoaded() {
    const cached = this.getUser();
    if (cached && this.hasDisplayIdentity(cached)) {
      return of(cached);
    }

    if (this.meRequest$) {
      return this.meRequest$;
    }

    this.meRequest$ = this.http.get(`${this.baseUrl}/me`).pipe(
      timeout(10000),
      tap(user => this.setCurrentUser(user)),
      catchError((error) => throwError(() => error)),
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

  private getInitialUser(): any | null {
    const cachedUser = localStorage.getItem(this.userStorageKey);
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch {
        localStorage.removeItem(this.userStorageKey);
      }
    }

    const token = this.getToken();
    if (!token) {
      return null;
    }

    return this.decodeToken(token);
  }

  private hasDisplayIdentity(user: any): boolean {
    return !!(user?.name || user?.email);
  }
}
