import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Home } from './pages/home/home/home';

import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

import { CartPage } from './pages/cart/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout/checkout-page/checkout-page';
import { OrderHistory } from './pages/orders/order-history/order-history';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { AddProduct } from './pages/admin/add-product/add-product';
import { EditProduct } from './pages/admin/edit-product/edit-product';

export const routes: Routes = [

  // 🔥 DEFAULT ROUTE (VERY IMPORTANT)
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: Home },

  { path: 'register', component: Register },

  { path: 'login', component: Login },

  { path: 'cart', component: CartPage, canActivate: [authGuard] },

  { path: 'checkout', component: CheckoutPage, canActivate: [authGuard] },

  { path: 'orders', component: OrderHistory, canActivate: [authGuard] },

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

  // 🔥 WILDCARD (MUST BE LAST)
  { path: '**', redirectTo: 'home' }
];
