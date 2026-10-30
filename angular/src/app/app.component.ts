import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { filter } from 'rxjs/operators';
import { PermissionService } from '@abp/ng.core';
import { ReplaceableComponentsService } from '@abp/ng.core';
import { eThemeBasicComponents } from '@abp/ng.theme.basic';
import { AppHeaderComponent } from './shared/components/app-header/app-header.component';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar></abp-loader-bar>
    <app-header *ngIf="showStoreHeader"></app-header>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  showStoreHeader = true;
  constructor(
    private replaceableComponents: ReplaceableComponentsService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.urlAfterRedirects || event.url);
      });
    // Thay thế toàn bộ Navbar chứ không chỉ NavItems
    this.replaceableComponents.add({
      component: AppHeaderComponent,
      key: eThemeBasicComponents.NavItems, // hoặc eThemeBasicComponents.ApplicationLayout
    });
  }
  private checkRoute(url: string): void {
    // Nếu URL bắt đầu bằng /admin hoặc các trang quản trị ABP như /identity, /tenant-management, /setting-management
    const isAdminRoute =
      url.startsWith('/admin') ||
      url.startsWith('/identity') ||
      url.startsWith('/tenant-management') ||
      url.startsWith('/setting-management');

    // Ẩn header nếu là admin route
    this.showStoreHeader = !isAdminRoute;
  }
}
