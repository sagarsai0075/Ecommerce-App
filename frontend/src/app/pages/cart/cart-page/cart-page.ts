import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../../core/services/cart';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage implements OnInit {

  // ✅ Always array
  items: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // ===============================
  // LOAD CART
  // ===============================
  loadCart() {

    this.cartService.getCart().subscribe((data: any) => {

      console.log('Cart API Response:', data);

      // ✅ Extract items array
      this.items = data?.items || [];

    });
  }

  // ===============================
  // INCREASE
  // ===============================
  increase(item: CartItem) {

    this.cartService
      .updateQuantity(item.product._id, item.quantity + 1)
      .subscribe(() => this.loadCart());

  }

  // ===============================
  // DECREASE
  // ===============================
  decrease(item: CartItem) {

    if (item.quantity <= 1) return;

    this.cartService
      .updateQuantity(item.product._id, item.quantity - 1)
      .subscribe(() => this.loadCart());

  }

  // ===============================
  // REMOVE
  // ===============================
  remove(item: CartItem) {

    this.cartService
      .removeFromCart(item.product._id)
      .subscribe(() => this.loadCart());

  }

  // ===============================
  // TOTAL PRICE
  // ===============================
  get total(): number {

    return this.items.reduce(
      (sum, item) =>
        sum + (item.product.price * item.quantity),
      0
    );

  }

}
