import { Injectable } from '@angular/core';

export interface CartItem {
  productId?: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

type CartLike = CartItem | Record<string, unknown>;

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private storageKey = 'cart';

  constructor() {}

  // 🔹 Get cart from localStorage
  getCart(): CartItem[] {
    const raw = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw.map(item => this.normalizeCartItem(item));
  }

  // 🔹 Save cart
  private saveCart(cart: CartItem[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  // 🔹 Add to cart
  addToCart(product: CartLike, qty: number = 1) {
    const cart = this.getCart();
    const key = this.getItemKey(product);
    const existing = cart.find(i => this.getItemKey(i) === key);
    const qtyToAdd = Number.isFinite(qty) && qty > 0 ? qty : 1;

    if (existing) {
      existing.qty += qtyToAdd;
    } else {
      cart.push(this.normalizeCartItem({ ...product, qty: qtyToAdd }));
    }

    this.saveCart(cart);
  }

  // 🔹 Increase quantity
  increase(itemOrId: CartLike | string) {
    const cart = this.getCart();
    const key = this.getItemKey(itemOrId);
    const item = cart.find(i => this.getItemKey(i) === key);
    if (item) {
      item.qty++;
      this.saveCart(cart);
    }
  }

  // 🔹 Decrease quantity
  decrease(itemOrId: CartLike | string) {
    const key = this.getItemKey(itemOrId);
    let cart = this.getCart();

    cart = cart
      .map(i =>
        this.getItemKey(i) === key
          ? { ...i, qty: i.qty - 1 }
          : i
      )
      .filter(i => i.qty > 0);

    this.saveCart(cart);
  }

  // 🔹 Remove item
  remove(itemOrId: CartLike | string) {
    const key = this.getItemKey(itemOrId);
    const cart = this.getCart().filter(
      i => this.getItemKey(i) !== key
    );
    this.saveCart(cart);
  }

  // 🔹 Get total
  getTotal(): number {
    return this.getCart().reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }

  // 🔹 Clear cart
  clearCart() {
    localStorage.removeItem(this.storageKey);
  }

  private getItemKey(item: CartLike | string): string {
    if (typeof item === 'string') {
      return item;
    }

    const asAny = item as any;
    return (
      asAny.productId ||
      asAny._id ||
      asAny.id ||
      asAny.product?._id ||
      asAny.product?.id ||
      asAny.name ||
      ''
    );
  }

  private normalizeCartItem(item: CartLike): CartItem {
    const asAny = item as any;
    const product = asAny.product || asAny;
    const qty = Number(asAny.qty ?? asAny.quantity ?? 1);

    return {
      productId: asAny.productId ?? product._id ?? product.id,
      name: asAny.name ?? product.name ?? 'Item',
      price: Number(asAny.price ?? product.price ?? 0),
      image: asAny.image ?? product.image,
      qty: qty > 0 ? qty : 1
    };
  }
}
