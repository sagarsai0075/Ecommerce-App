import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';
export const routes: Routes = [

  // 🔥 DEFAULT
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home/home').then(m => m.Home)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then(m => m.Register)
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then(m => m.ForgotPassword)
  },

  // ✅ PRODUCTS (NEW)
  {
    path: 'products/:category',
    loadComponent: () =>
      import('./pages/products/products').then(m => m.Products)
  },

  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart-page/cart-page').then(m => m.CartPage),
    canActivate: [authGuard]
  },

  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout-page/checkout-page').then(m => m.CheckoutPage),
    canActivate: [authGuard]
  },

  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/orders/order-history/order-history').then(m => m.OrderHistory),
    canActivate: [authGuard]
  },
  // USER PAGES
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [authGuard]
  },

  {
    path: 'coupons',
    loadComponent: () =>
      import('./pages/coupons/coupons').then(m => m.Coupons),
    canActivate: [authGuard]
  },

  {
    path: 'seller',
    loadComponent: () =>
      import('./pages/seller/seller').then(m => m.Seller),
    canActivate: [authGuard]
  },

  // ADMIN
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [adminGuard]
  },

  {
    path: 'admin/add-product',
    loadComponent: () =>
      import('./pages/admin/add-product/add-product').then(m => m.AddProduct),
    canActivate: [adminGuard]
  },

  {
    path: 'admin/edit-product',
    loadComponent: () =>
      import('./pages/admin/edit-product/edit-product').then(m => m.EditProduct),
    canActivate: [adminGuard]
  },

  // 🔥 WILDCARD (LAST)
  { path: '**', redirectTo: 'home' }

];
