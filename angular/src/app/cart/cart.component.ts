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

  // Phương thức thanh toán được chọn ('COD' hoặc 'BANK')
  paymentMethod: 'COD' | 'BANK' = 'COD';

  // Điều khiển hiển thị modal thành công khi chọn COD
  showCodSuccessModal = false;
  placedOrderCode = '';

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
    console.log('Phương thức đang chọn là:', this.paymentMethod);
    if (!this.customerName.trim() || !this.phoneNumber.trim() || !this.address.trim()) {
      this.toaster.warn('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    if (this.items.length === 0) {
      this.toaster.warn('Giỏ hàng đang trống!');
      return;
    }

    this.isSubmitting = true;

    // Gán dữ liệu đơn hàng (nếu DTO của backend có trường paymentMethod, bạn có thể truyền kèm this.paymentMethod)
    const orderData: CreateOrderDto = {
      customerName: this.customerName,
      phoneNumber: this.phoneNumber,
      address: this.address,
      paymentMethod: this.paymentMethod,
      items: this.items.map(item => ({
        productVariantId: item.variantId,
        productName: item.productName,
        sku: item.sku,
        unitPrice: item.price,
        quantity: item.quantity,
      })),
    };

    const currentTotalPrice = this.items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0,
    );

    this.orderService.create(orderData).subscribe({
      next: (res: any) => {
        this.cartService.clearCart();
        this.isSubmitting = false;

        // 1. Phân tích dữ liệu nếu kết quả trả về là chuỗi JSON
        let data = res;
        if (typeof res === 'string') {
          try {
            data = JSON.parse(res);
          } catch (e) {
            data = res;
          }
        }

        // 2. Trích xuất chính xác ID (Guid)
        let finalId = '';
        if (typeof data === 'object' && data !== null) {
          finalId = data.id || '';
        } else if (typeof data === 'string') {
          finalId = data.replace(/"/g, '').trim();
        }

        // 3. Tạo mã đơn hàng hiển thị
        const displayCode =
          data?.orderCode || (finalId ? finalId.substring(0, 8).toUpperCase() : 'ORDER');
        this.placedOrderCode = displayCode;

        // 4. Rẽ nhánh theo phương thức thanh toán
        if (this.paymentMethod === 'COD') {
          // Trường hợp COD: Hiển thị thông báo cảm ơn
          this.toaster.success('Cảm ơn bạn đã đặt hàng thành công!');
          this.showCodSuccessModal = true;
        } else {
          // Trường hợp CHUYỂN KHOẢN: Điều hướng sang trang thanh toán QR
          this.router.navigate(['/payment', finalId], {
            queryParams: {
              amount: currentTotalPrice,
              code: displayCode,
            },
            state: { totalAmount: currentTotalPrice },
          });
        }
      },
      error: err => {
        this.isSubmitting = false;
        this.toaster.error(err?.error?.message || 'Có lỗi xảy ra khi tạo đơn hàng!');
      },
    });
  }

  closeCodModal(): void {
    this.showCodSuccessModal = false;
    this.router.navigate(['/']); // Đóng modal và chuyển về trang chủ
  }
}
