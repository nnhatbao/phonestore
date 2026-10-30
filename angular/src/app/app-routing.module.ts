import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, PermissionGuard } from '@abp/ng.core';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { ClientOnlyGuard } from './guards/client-only.guard';
import { PaymentComponent } from './payment/payment.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderManagementComponent } from './admin/order-management/order-management.component';
import { InventoryComponent } from './admin/inventory/inventory.component';

const routes: Routes = [
  // ================= STOREFRONT =================
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products',
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule),
    canActivate: [ClientOnlyGuard],
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'payment/:id',
    component: PaymentComponent, // Hoặc loadChildren nếu payment là Module riêng
    canActivate: [AuthGuard],
  },
  {
    path: 'orders',
    component: OrdersComponent, // Hoặc loadChildren nếu orders là Module riêng
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-account',
    loadChildren: () => import('@abp/ng.account').then(m => m.AccountModule.forLazy()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
  },

  // ================= ADMIN PORTAL =================
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, PermissionGuard],
    data: {
      requiredPolicy: 'PhoneStore.Products',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./admin/product-management/product-management.module').then(
            m => m.ProductManagementModule,
          ),
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./admin/category-management/category-management.module').then(
            m => m.CategoryManagementModule,
          ),
      },
      {
        path: 'orders',
        component: OrderManagementComponent,
      },
      {
        path: 'inventory',
        loadChildren: () => import('./admin/inventory/inventory.module').then(m => m.InventoryModule),
      },

      // Đưa Identity Module vào làm route con của Admin
      {
        path: 'identity',
        loadChildren: () => import('@abp/ng.identity').then(m => m.IdentityModule.forLazy()),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
