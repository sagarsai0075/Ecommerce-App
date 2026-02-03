import { Routes } from '@angular/router';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { ProductList } from './pages/products/product-list/product-list';
import { ProductDetail } from './pages/products/product-detail/product-detail';
import { authGuard } from './core/guards/auth-guard';
import { CartPage } from './pages/cart/cart-page/cart-page';
import { CheckoutPage } from './pages/checkout/checkout-page/checkout-page';
import { OrderHistory } from './pages/orders/order-history/order-history';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { AddProduct } from './pages/admin/add-product/add-product';
import { EditProduct } from './pages/admin/edit-product/edit-product';
import { adminGuard } from './core/guards/admin-guard';
import { NotFound } from './pages/not-found/not-found';



export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  { path: 'products', component: ProductList, canActivate: [authGuard] },
  { path: 'products', component: ProductList, canActivate: [authGuard] },
  { path: 'products/:id', component: ProductDetail, canActivate: [authGuard] },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'cart', component: CartPage, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPage, canActivate: [authGuard] },
  { path: 'orders', component: OrderHistory, canActivate: [authGuard] },

{ path: '**', component: NotFound },
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
  }

];
