import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@NgModule({
  declarations: [ProductsComponent, ProductDetailComponent],
  imports: [SharedModule, ProductsRoutingModule],
})
export class ProductsModule {}
