import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../shared/services/cart.service';
import { CartItem } from '../shared/models/cart-item.model';
import { OrderService } from '../proxy/orders';
import { CreateOrderDto } from '../proxy/orders/models';
import { ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];

  // Dữ liệu form đặt hàng
  customerName = '';
  phoneNumber = '';
  address = '';
  isSubmitting = false;

  constructor(
    public readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly toaster: ToasterService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(res => {
      this.items = res;
    });
  }

  increaseQty(item: CartItem): void {
    this.cartService.updateQuantity(item.variantId, item.quantity + 1);
  }

  decreaseQty(item: CartItem): void {
    this.cartService.updateQuantity(item.variantId, item.quantity - 1);
  }

  removeItem(variantId: string): void {
    this.cartService.removeFromCart(variantId);
  }

  checkout(): void {
    if (!this.customerName.trim() || !this.phoneNumber.trim() || !this.address.trim()) {
      this.toaster.warn('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    if (this.items.length === 0) {
      this.toaster.warn('Giỏ hàng đang trống!');
      return;
    }

    this.isSubmitting = true;

    const orderData: CreateOrderDto = {
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      address: this.address,
      items: this.items.map(item => ({
        productVariantId: item.variantId,
        productName: item.productName,
        sku: item.sku,
        unitPrice: item.price,
        quantity: item.quantity,
      })),
    };

    this.orderService.create(orderData).subscribe({
      next: (orderId: string) => {
        this.cartService.clearCart();
        this.isSubmitting = false;

        // Xóa bỏ triệt để dấu ngoặc kép thừa nếu có
        const cleanOrderId = String(orderId).replace(/"/g, '').trim();

        this.router.navigate(['/payment', cleanOrderId]);
      },
      error: err => {
        this.isSubmitting = false;
        this.toaster.error(err?.error?.message || 'Có lỗi xảy ra khi tạo đơn hàng!');
      },
    });
  }
}
