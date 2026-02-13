import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
export class ProductService {
  private readonly localProductsKey = 'localProducts';

  constructor() {}

  getAllProducts(search?: string): Observable<Product[]> {
    const products = this.getLocalProducts();
    if (!search) {
      return of(products);
    }

    const normalized = search.toLowerCase();
    return of(
      products.filter(product =>
        `${product.name} ${product.description || ''}`
          .toLowerCase()
          .includes(normalized)
      )
    );
  }

  getProductById(id: string): Observable<Product | undefined> {
    const products = this.getLocalProducts();
    return of(products.find(product => product._id === id));
  }

  createProduct(data: any): Observable<Product> {
    const products = this.getLocalProducts();
    const product: Product = {
      _id: this.createLocalId(),
      name: String(data?.name ?? '').trim() || 'New Product',
      description: String(data?.description ?? '').trim(),
      price: Number(data?.price ?? 0),
      image: data?.image
    };

    products.unshift(product);
    this.saveLocalProducts(products);
    return of(product);
  }

  private getLocalProducts(): Product[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.localProductsKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as Product[];
    } catch {
      return [];
    }
  }

  private saveLocalProducts(products: Product[]) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.localProductsKey, JSON.stringify(products));
  }

  private createLocalId(): string {
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }


}
