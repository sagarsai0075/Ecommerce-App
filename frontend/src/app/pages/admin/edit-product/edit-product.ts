import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../../core/services/product';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-product.html',
  styleUrls: ['./edit-product.css']
})
export class EditProduct implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((data: Product[]) => {
      this.products = data;
    });
  }
  
}
