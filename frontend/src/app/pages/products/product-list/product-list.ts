import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../core/services/product';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {

  products: Product[] = [];
  loading = true;   // 👈 ADD THIS

  constructor(
    private productService: Product,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const search = params['search'];
      this.loadProducts(search);
    });
  }

  loadProducts(search?: string) {
    this.loading = true;   // 👈 START LOADING

    this.productService.getAllProducts(search).subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.loading = false;   // 👈 STOP LOADING
      }
    });
  }
}
