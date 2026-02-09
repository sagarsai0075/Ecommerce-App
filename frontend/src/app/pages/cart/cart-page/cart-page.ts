import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.html',
  styleUrls: ['./cart-page.css']
})
export class CartPage implements OnInit {

  items: any[] = [];

  ngOnInit(): void {
    this.loadCart();
  }

  // ===============================
  // LOAD CART
  // ===============================
  loadCart() {

    const storedCart = localStorage.getItem('cart');

    if (storedCart) {
      this.items = JSON.parse(storedCart);
    } else {
      this.items = [];
    }

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

    if (item.qty <= 1) return;

    item.qty--;

    this.saveCart();
  }

  // ===============================
  // REMOVE
  // ===============================
  remove(item: any) {

    this.items = this.items.filter(i => i.name !== item.name);

    this.saveCart();
  }

  // ===============================
  // SAVE CART
  // ===============================
  saveCart() {

    localStorage.setItem('cart', JSON.stringify(this.items));

    this.loadCart();
  }

  // ===============================
  // TOTAL
  // ===============================
  get total(): number {

    return this.items.reduce(
      (sum, item) =>
        sum + (item.price * item.qty),
      0
    );
  }

}
