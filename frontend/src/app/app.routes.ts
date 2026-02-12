import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { Home } from './pages/home/home/home';

import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

import { CartPage } from './pages/cart/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout/checkout-page/checkout-page';
import { OrderHistory } from './pages/orders/order-history/order-history';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { AddProduct } from './pages/admin/add-product/add-product';
import { EditProduct } from './pages/admin/edit-product/edit-product';
import { Products } from './pages/products/products';
import { Profile } from './pages/profile/profile';
import { Coupons } from './pages/coupons/coupons';
import { Seller } from './pages/seller/seller';
export const routes: Routes = [

  // 🔥 DEFAULT
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },

  { path: 'register', component: Register },

  { path: 'login', component: Login },

  { path: 'forgot-password', component: ForgotPassword },

  // ✅ PRODUCTS (NEW)
  { path: 'products/:category', component: Products },

  { path: 'cart', component: CartPage, canActivate: [authGuard] },

  { path: 'checkout', component: CheckoutPage, canActivate: [authGuard] },

  { path: 'orders', component: OrderHistory, canActivate: [authGuard] },
  // USER PAGES
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  { path: 'coupons', component: Coupons, canActivate: [authGuard] },

  { path: 'seller', component: Seller, canActivate: [authGuard] },

  // ADMIN
  {
    path: 'admin',
    component: Dashboard,
    canActivate: [adminGuard]
  },

  {
    path: 'admin/add-product',
    component: AddProduct,
    canActivate: [adminGuard]
  },

  {
    path: 'admin/edit-product',
    component: EditProduct,
    canActivate: [adminGuard]
  },

  // 🔥 WILDCARD (LAST)
  { path: '**', redirectTo: 'home' }

];
