import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryManagementComponent } from './category-management.component';

const routes: Routes = [
  {
    path: '', // Để rỗng để khi vào /admin/categories sẽ hiển thị component này
    component: CategoryManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryManagementRoutingModule {}
