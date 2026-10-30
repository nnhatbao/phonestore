import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartComponent],
  imports: [
    SharedModule,
    CartRoutingModule,
    FormsModule, // Bắt buộc phải có routing module này
  ],
})
export class CartModule {}
