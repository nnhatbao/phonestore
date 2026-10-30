import { Component } from '@angular/core';
import { AuthService, ConfigStateService, CurrentUserDto } from '@abp/ng.core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  currentUser$: Observable<CurrentUserDto> = this.configState.getOne$('currentUser');

  constructor(
    private readonly authService: AuthService,
    private readonly configState: ConfigStateService,
  ) {}

  login(): void {
    this.authService.navigateToLogin();
  }

  logout(): void {
    this.authService.logout().subscribe();
  }
}
