import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';

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
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  // LOAD CART
  loadCart() {
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items as any[];

        if (this.cartItems.length === 0) {
          alert('Your cart is empty!');
          this.router.navigate(['/cart']);
          return;
        }

        this.calculatePrice();
      }
    });
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
    const orderItems = this.cartItems.map(item => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item.productId
    }));

    const addressParts = [
      this.order.fullName,
      this.order.mobile,
      this.order.houseNo,
      this.order.landmark
    ].filter(Boolean);

    const payload = {
      orderItems,
      shippingAddress: {
        address: addressParts.join(', '),
        city: this.order.state || 'NA',
        postalCode: this.order.pincode || 'NA',
        country: 'India'
      },
      paymentMethod: this.order.paymentMode,
      taxPrice: 0,
      shippingPrice: this.price.delivery,
      totalPrice: this.price.total
    };

    this.orderService.placeOrder(payload).subscribe({
      next: () => {
        this.cartService.clearCart().subscribe({
          next: () => this.router.navigate(['/'])
        });
      }
    });
  }
}
