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
  isLoading = false;
  private hasRetried = false;

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
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.items = items as any[];
        this.isLoading = false;
        if (this.items.length === 0 && !this.hasRetried) {
          this.hasRetried = true;
          setTimeout(() => this.loadCart(), 300);
        }
      },
      error: () => {
        this.items = [];
        this.isLoading = false;
      }
    });
  }

  // ===============================
  // INCREASE
  // ===============================
  increase(item: any) {
    const nextQty = (item.qty || 0) + 1;
    this.cartService.updateQuantity(item, nextQty).subscribe({
      next: () => this.loadCart()
    });
  }

  // ===============================
  // DECREASE
  // ===============================
  decrease(item: any) {
    const nextQty = (item.qty || 0) - 1;
    if (nextQty <= 0) {
      this.cartService.remove(item).subscribe({
        next: () => this.loadCart()
      });
      return;
    }

    this.cartService.updateQuantity(item, nextQty).subscribe({
      next: () => this.loadCart()
    });
  }

  // ===============================
  // REMOVE
  // ===============================
  remove(item: any) {
    this.cartService.remove(item).subscribe({
      next: () => this.loadCart()
    });
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
