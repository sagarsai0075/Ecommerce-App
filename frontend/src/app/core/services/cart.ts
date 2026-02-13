import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

export interface CartItem {
  productId?: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  localOnly?: boolean;
}

type CartLike = CartItem | Record<string, unknown>;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly localCartKey = 'localCartItems';
  private readonly localIdPrefix = 'local:';

  constructor() {}

  // 🔹 Get cart from local storage
  getCart(): Observable<CartItem[]> {
    return of(this.getLocalCartItems());
  }

  // 🔹 Add to cart
  addToCart(product: CartLike, qty: number = 1) {
    const qtyToAdd = Number.isFinite(qty) && qty > 0 ? qty : 1;
    this.addToLocalCartInternal(product, qtyToAdd);
    return of({ localOnly: true });
  }

  addToLocalCart(product: CartLike, qty: number = 1) {
    const qtyToAdd = Number.isFinite(qty) && qty > 0 ? qty : 1;
    this.addToLocalCartInternal(product, qtyToAdd);
    return of({ localOnly: true });
  }

  // 🔹 Update quantity
  updateQuantity(itemOrId: CartLike | string, qty: number) {
    const productId = this.getProductId(itemOrId);
    if (!productId) {
      return throwError(() => new Error('Product ID is required to update cart'));
    }
    this.updateLocalQuantity(productId, qty);
    return of({ localOnly: true });
  }

  // 🔹 Remove item
  remove(itemOrId: CartLike | string) {
    const productId = this.getProductId(itemOrId);
    if (!productId) {
      return throwError(() => new Error('Product ID is required to remove from cart'));
    }
    this.removeLocalItem(productId);
    return of({ localOnly: true });
  }

  // 🔹 Clear cart
  clearCart() {
    this.clearLocalCart();
    return of({ localOnly: true });
  }

  private getProductId(item: CartLike | string): string | null {
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
      null
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
      qty: qty > 0 ? qty : 1,
      localOnly: Boolean(asAny.localOnly)
    };
  }

  private getLocalCartItems(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.localCartKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map(item => this.normalizeLocalItem(item));
    } catch {
      return [];
    }
  }

  private saveLocalCartItems(items: CartItem[]) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.localCartKey, JSON.stringify(items));
  }

  private normalizeLocalItem(item: CartLike): CartItem {
    const normalized = this.normalizeCartItem(item);
    const localId = this.getLocalProductId(item, normalized.productId || null);

    return {
      ...normalized,
      productId: localId,
      localOnly: true
    };
  }

  private addToLocalCartInternal(product: CartLike, qtyToAdd: number) {
    const items = this.getLocalCartItems();
    const localId = this.getLocalProductId(product, null);
    const normalized = this.normalizeLocalItem({ ...product, productId: localId });

    const existingIndex = items.findIndex(item => item.productId === localId);
    if (existingIndex >= 0) {
      const nextQty = (items[existingIndex].qty || 0) + qtyToAdd;
      items[existingIndex].qty = nextQty > 0 ? nextQty : 1;
    } else {
      items.push({
        ...normalized,
        qty: qtyToAdd
      });
    }

    this.saveLocalCartItems(items);
  }

  private updateLocalQuantity(productId: string, qty: number) {
    const items = this.getLocalCartItems();
    const nextQty = Number.isFinite(qty) ? qty : 1;
    const updatedItems = items
      .map(item =>
        item.productId === productId
          ? { ...item, qty: nextQty > 0 ? nextQty : 1 }
          : item
      )
      .filter(item => item.qty > 0);

    this.saveLocalCartItems(updatedItems);
  }

  private removeLocalItem(productId: string) {
    const items = this.getLocalCartItems();
    const updatedItems = items.filter(item => item.productId !== productId);
    this.saveLocalCartItems(updatedItems);
  }

  private clearLocalCart() {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(this.localCartKey);
  }

  private getLocalProductId(product: CartLike, existingId: string | null): string {
    const asAny = product as any;
    const name = String(asAny.name ?? 'item').trim();
    const price = Number(asAny.price ?? 0);
    const slug = this.slugify(name) || 'item';

    return `${this.localIdPrefix}${slug}-${price}`;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
