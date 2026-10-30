import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoryManagementRoutingModule } from './category-management-routing.module';
import { CategoryManagementComponent } from './category-management.component';

@NgModule({
  declarations: [CategoryManagementComponent],
  imports: [SharedModule, ReactiveFormsModule, CategoryManagementRoutingModule],
})
export class CategoryManagementModule {}
