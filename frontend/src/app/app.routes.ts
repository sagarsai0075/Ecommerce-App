import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetail } from './pages/products/product-detail/product-detail';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'products', component: ProductList, canActivate: [authGuard] },
 { path: 'products', component: ProductList, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetail, canActivate: [authGuard] },
  { path: '', redirectTo: 'products', pathMatch: 'full' }
];
