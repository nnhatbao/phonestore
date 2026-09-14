import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routes: RoutesService) {
  return () => {
    routes.add([
      {
        path: '/products',
        name: '::Menu:Products',
        iconClass: 'fas fa-mobile-alt', // Icon điện thoại FontAwesome
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/cart',
        name: 'Giỏ hàng',
        iconClass: 'fas fa-shopping-cart',
        order: 3,
        layout: eLayoutType.application,
      },
    ]);
  };
}
