import { Injectable } from '@angular/core';
import { Product } from './product';
import { environment } from '../../../environments/environment';


export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'cart';

  constructor() {}

  // 🔹 Get cart from localStorage
  getCart(): CartItem[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  // 🔹 Save cart
  private saveCart(cart: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  // 🔹 Add to cart
  addToCart(product: Product) {
    const cart = this.getCart();
    const item = cart.find(i => i.product._id === product._id);

    if (item) {
      item.quantity++;
    } else {
      cart.push({ product, quantity: 1 });
    }

    this.saveCart(cart);
  }

  // 🔹 Increase quantity
  increase(productId: string) {
    const cart = this.getCart();
    const item = cart.find(i => i.product._id === productId);
    if (item) item.quantity++;
    this.saveCart(cart);
  }

  // 🔹 Decrease quantity
  decrease(productId: string) {
    let cart = this.getCart();
    cart = cart.map(i =>
      i.product._id === productId
        ? { ...i, quantity: i.quantity - 1 }
        : i
    ).filter(i => i.quantity > 0);

    this.saveCart(cart);
  }

  // 🔹 Remove item
  remove(productId: string) {
    const cart = this.getCart().filter(
      i => i.product._id !== productId
    );
    this.saveCart(cart);
  }

  // 🔹 Get total
  getTotal(): number {
    return this.getCart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  // 🔹 Clear cart
  clearCart() {
    localStorage.removeItem(this.storageKey);
  }
}
