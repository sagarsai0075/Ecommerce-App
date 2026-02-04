import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  placeOrder() {
    return this.http.post(this.baseUrl, {});
  }

  getMyOrders() {
    return this.http.get(this.baseUrl);
  }
}
