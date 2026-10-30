import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, ConfigStateService, PermissionService, CurrentUserDto } from '@abp/ng.core';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  isDropdownOpen = false;
  searchKeyword = '';
  cartCount = 0;
  currentUser: CurrentUserDto | null = null;
  hasAdminPermission = false;

  // Getter kiểm tra trạng thái đăng nhập chuẩn của ABP
  get isAuthenticated(): boolean {
    return !!this.currentUser?.isAuthenticated;
  }

  constructor(
    public readonly authService: AuthService,
    private readonly configState: ConfigStateService,
    private readonly permissionService: PermissionService,
    private readonly cartService: CartService,
    private readonly router: Router,
  ) {}

  openProfile(): void {
    this.isDropdownOpen = false;
    // Lấy issuer từ cấu hình oAuthConfig
    const issuerUrl = environment.oAuthConfig?.issuer || 'https://localhost:44383/';
    // Đảm bảo có dấu / ở cuối URL
    const baseUrl = issuerUrl.endsWith('/') ? issuerUrl : `${issuerUrl}/`;

    window.location.href = `${baseUrl}Account/Manage`;
  }

  ngOnInit(): void {
    // 1. Lắng nghe thông tin người dùng từ ConfigState
    this.configState.getOne$('currentUser').subscribe(user => {
      this.currentUser = user;
    });

    // 2. Lắng nghe giỏ hàng
    this.cartService.cart$.subscribe(items => {
      this.cartCount = (items || []).reduce((sum, item) => sum + (item.quantity || 1), 0);
    });

    // 3. Kiểm tra quyền
    this.hasAdminPermission = this.permissionService.getGrantedPolicy('PhoneStore.Products');
  }

  onSearch(): void {
    if (this.searchKeyword.trim()) {
      this.router.navigate(['/products'], { queryParams: { q: this.searchKeyword.trim() } });
    }
  }

  clearSearch(): void {
    this.searchKeyword = '';
    // Điều hướng về /products và xóa query param ?q=...
    this.router.navigate(['/products']);
  }

  login(): void {
    this.authService.navigateToLogin();
  }
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout(): void {
    this.isDropdownOpen = false;
    this.authService.logout().subscribe();
  }
}
