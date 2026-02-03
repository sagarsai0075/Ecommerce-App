import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Product {

  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

 getAllProducts(search?: string) {
  if (search) {
    return this.http.get<Product[]>(`${this.baseUrl}?search=${search}`);
  }
  return this.http.get<Product[]>(this.baseUrl);
}


  getProductById(id: string) {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
  createProduct(data: any) {
  return this.http.post(this.baseUrl, data);
}


}
