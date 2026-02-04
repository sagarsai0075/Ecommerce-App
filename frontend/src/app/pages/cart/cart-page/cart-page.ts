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

  items: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe(data => {
      this.items = data;
    });
  }

  increase(item: CartItem) {
    this.cartService
      .updateQuantity(item.product._id, item.quantity + 1)
      .subscribe(() => this.loadCart());
  }

  decrease(item: CartItem) {
    if (item.quantity === 1) return;

    this.cartService
      .updateQuantity(item.product._id, item.quantity - 1)
      .subscribe(() => this.loadCart());
  }

  remove(item: CartItem) {
    this.cartService
      .removeFromCart(item.product._id)
      .subscribe(() => this.loadCart());
  }

  get total() {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}
