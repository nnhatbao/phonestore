import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductManagementRoutingModule } from './product-management-routing.module';
import { ProductManagementComponent } from './product-management.component';

@NgModule({
  declarations: [ProductManagementComponent],
  imports: [SharedModule, ReactiveFormsModule, ProductManagementRoutingModule],
})
export class ProductManagementModule {}
