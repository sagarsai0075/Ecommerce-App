import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/services/product';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {

  products: Product[] = [];
  loading = true;

  constructor(private productService: Product) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      }
    });
  }
}
