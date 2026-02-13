import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../core/services/product';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: [''],
      price: [''],
      description: ['']
    });
  }

  submit() {
    this.productService.createProduct(this.form.value).subscribe(() => {
      this.router.navigateByUrl('/admin');
    });
  }
}
