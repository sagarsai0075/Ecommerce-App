import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = `${environment.apiUrl}/seller`;

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get(`${this.baseUrl}/profile`);
  }

  updateProfile(profile: any) {
    return this.http.put(`${this.baseUrl}/profile`, profile);
  }

  getStats() {
    return this.http.get(`${this.baseUrl}/stats`);
  }

  updateStats(stats: any) {
    return this.http.put(`${this.baseUrl}/stats`, stats);
  }
}
