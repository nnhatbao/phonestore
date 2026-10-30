import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductManagementComponent } from './product-management.component';

const routes: Routes = [
  {
    path: '', // ĐỂ RỖNG Ở ĐÂY
    component: ProductManagementComponent, // BẮT BUỘC PHẢI CÓ DÒNG NÀY
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductManagementRoutingModule {}
