import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface LocalOrder {
  _id: string;
  totalAmount: number;
  items: Array<{ name: string; qty: number; image?: string; price: number; product?: string }>;
  shippingAddress?: {
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  paymentMethod?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly localOrdersKey = 'localOrders';

  constructor() {}

  placeOrder(payload: any) {
    const orders = this.getLocalOrders();
    const order: LocalOrder = {
      _id: this.createLocalId(),
      totalAmount: Number(payload?.totalPrice ?? 0),
      items: Array.isArray(payload?.orderItems) ? payload.orderItems : [],
      shippingAddress: payload?.shippingAddress,
      paymentMethod: payload?.paymentMethod,
      createdAt: new Date().toISOString()
    };

    orders.unshift(order);
    this.saveLocalOrders(orders);
    return of(order);
  }

  getMyOrders() {
    return of(this.getLocalOrders());
  }

  private getLocalOrders(): LocalOrder[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    try {
      const raw = localStorage.getItem(this.localOrdersKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as LocalOrder[];
    } catch {
      return [];
    }
  }

  private saveLocalOrders(orders: LocalOrder[]) {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(this.localOrdersKey, JSON.stringify(orders));
  }

  private createLocalId(): string {
    return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
