import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage implements OnInit {

  items: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // ===============================
  // LOAD CART
  // ===============================
  loadCart() {

    const storedCart = localStorage.getItem('cart');

    this.items = storedCart
      ? JSON.parse(storedCart)
      : [];

    console.log('Cart Items:', this.items);
  }

  // ===============================
  // INCREASE
  // ===============================
  increase(item: any) {

    item.qty++;
    this.saveCart();

  }

  // ===============================
  // DECREASE
  // ===============================
  decrease(item: any) {

    if (item.qty > 1) {
      item.qty--;
      this.saveCart();
    }

  }

  // ===============================
  // REMOVE
  // ===============================
  remove(item: any) {

    this.items = this.items.filter(
      i => i.name !== item.name
    );

    this.saveCart();

  }

  // ===============================
  // SAVE CART
  // ===============================
  saveCart() {

    localStorage.setItem(
      'cart',
      JSON.stringify(this.items)
    );

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
