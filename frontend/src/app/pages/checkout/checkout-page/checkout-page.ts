import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.css']
})
export class CheckoutPage {

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  placeOrder() {
    this.orderService.placeOrder().subscribe(() => {
      this.router.navigateByUrl('/orders');
    });
  }
}
