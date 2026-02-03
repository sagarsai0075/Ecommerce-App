import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <div class="container">
      <h2>404 – Page Not Found</h2>
      <a routerLink="/products">Go to Products</a>
    </div>
  `
})
export class NotFound {}
