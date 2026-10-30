import { RoutesService, eLayoutType, PermissionService } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  {
    provide: APP_INITIALIZER,
    useFactory: configureRoutes,
    deps: [RoutesService, PermissionService],
    multi: true,
  },
];

function configureRoutes(routes: RoutesService, permissionService: PermissionService) {
  return () => {
    // Kiểm tra quyền Admin PhoneStore
    const isAdmin = permissionService.getGrantedPolicy('PhoneStore.Products');

    if (isAdmin) {
      // MENU RIÊNG CHO TÀI KHOẢN QUẢN TRỊ
      routes.add([
        {
          path: '/admin/products',
          name: 'Quản lý kho hàng',
          iconClass: 'fas fa-boxes',
          order: 1,
          layout: eLayoutType.application,
        },
        {
          path: '/admin/inventory', // <-- ĐƯỜNG DẪN ĐẾN TRANG QUẢN LÝ KHO
          name: 'Quản lý kho',
          iconClass: 'fas fa-warehouse', // Icon kho hàng
          order: 2,
          layout: eLayoutType.application,
        },
        {
          path: '/admin/categories',
          name: 'Quản lý danh mục',
          iconClass: 'fas fa-tags',
          order: 2,
          layout: eLayoutType.application,
        },
      ]);
    } else {
      // MENU DÀNH CHO KHÁCH HÀNG THƯỜNG
      routes.add([
        {
          path: '/products',
          name: 'Sản phẩm',
          iconClass: 'fas fa-mobile-alt',
          order: 1,
          layout: eLayoutType.application,
        },
        {
          path: '/cart',
          name: 'Giỏ hàng',
          iconClass: 'fas fa-shopping-cart',
          order: 2,
          layout: eLayoutType.application,
        },
      ]);
    }
  };
}
