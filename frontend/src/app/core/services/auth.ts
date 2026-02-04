import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

 register(data: {
  name: string;
  email: string;
  password: string;
  number: string;   // ✅ ADD THIS
}) {
  return this.http.post(`${this.baseUrl}/register`, data);
}


  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
  }
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
