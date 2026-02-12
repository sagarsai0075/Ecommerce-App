import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.css']
})
export class CheckoutPage implements OnInit {

  // USER ORDER
  order = {
    fullName: '',
    mobile: '',
    houseNo: '',
    landmark: '',
    state: '',
    pincode: '',
    paymentMode: 'COD'
  };

  // CART
  cartItems: any[] = [];

  // PRICE
  price = {
    subtotal: 0,
    delivery: 0,
    total: 0
  };

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.calculatePrice();
  }

  // LOAD CART
  loadCart() {
    this.cartItems = this.cartService.getCart();

    // If cart empty → go back
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      this.router.navigate(['/cart']);
    }
  }

  // CALCULATE PRICE
  calculatePrice() {

    this.price.subtotal = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // FREE DELIVERY ABOVE 1000
    this.price.delivery =
      this.price.subtotal > 1000 ? 0 : 50;

    this.price.total =
      this.price.subtotal + this.price.delivery;
  }

  // PLACE ORDER
  placeOrder() {

    const finalOrder = {
      customer: this.order,
      items: this.cartItems,
      price: this.price,
      date: new Date()
    };

    console.log('Order Placed:', finalOrder);

    // CLEAR CART AFTER ORDER
    this.cartService.clearCart();

   

    // GO TO HOME / SUCCESS PAGE
    this.router.navigate(['/']);
  }
}
