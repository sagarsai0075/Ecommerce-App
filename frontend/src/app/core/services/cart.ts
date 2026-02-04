import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private baseUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart() {
    return this.http.get<CartItem[]>(this.baseUrl);
  }

  addToCart(productId: string, quantity = 1) {
    return this.http.post(this.baseUrl, { productId, quantity });
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http.put(this.baseUrl, { productId, quantity });
  }

  removeFromCart(productId: string) {
    return this.http.delete(`${this.baseUrl}/${productId}`);
  }
}
