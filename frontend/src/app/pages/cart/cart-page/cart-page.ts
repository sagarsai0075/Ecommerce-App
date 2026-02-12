import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage implements OnInit {

  items: any[] = [];

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // ===============================
  // LOAD CART
  // ===============================
  loadCart() {
    this.items = this.cartService.getCart();
  }

  // ===============================
  // INCREASE
  // ===============================
  increase(item: any) {
    this.cartService.increase(item);
    this.loadCart();
  }

  // ===============================
  // DECREASE
  // ===============================
  decrease(item: any) {
    this.cartService.decrease(item);
    this.loadCart();
  }

  // ===============================
  // REMOVE
  // ===============================
  remove(item: any) {
    this.cartService.remove(item);
    this.loadCart();
  }

  // ===============================
  // TOTAL
  // ===============================
  get total(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }

  // ===============================
  // GO TO CHECKOUT
  // ===============================
  goToCheckout() {

    this.router.navigate(['/checkout']);

  }


}
