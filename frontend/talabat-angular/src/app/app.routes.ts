import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'Talabat Clone — Order food & groceries delivered fast',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products-list.component').then((m) => m.ProductsListComponent),
    title: 'Menu — Talabat Clone',
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail.component').then((m) => m.ProductDetailComponent),
    title: 'Product details — Talabat Clone',
  },
  {
    path: 'basket',
    loadComponent: () => import('./features/basket/basket.component').then((m) => m.BasketComponent),
    title: 'Your basket — Talabat Clone',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'Checkout — Talabat Clone',
  },
  {
    path: 'payment',
    loadComponent: () => import('./features/payment/payment.component').then((m) => m.PaymentComponent),
    canActivate: [authGuard],
    title: 'Payment — Talabat Clone',
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/orders-list.component').then((m) => m.OrdersListComponent),
    canActivate: [authGuard],
    title: 'My orders — Talabat Clone',
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./features/orders/order-detail.component').then((m) => m.OrderDetailComponent),
    canActivate: [authGuard],
    title: 'Order details — Talabat Clone',
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Log in — Talabat Clone',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Sign up — Talabat Clone',
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'Profile — Talabat Clone',
  },
  { path: '**', redirectTo: '' },
];
