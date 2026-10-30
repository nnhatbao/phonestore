import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { PermissionService } from '@abp/ng.core';

@Injectable({
  providedIn: 'root',
})
export class ClientOnlyGuard implements CanActivate {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly router: Router,
  ) {}

  canActivate(): boolean {
    const isAdmin = this.permissionService.getGrantedPolicy('PhoneStore.Products');
    if (isAdmin) {
      // Nếu là Admin, tự động chuyển về trang quản trị
      this.router.navigate(['/admin']);
      return false;
    }
    return true;
  }
}
