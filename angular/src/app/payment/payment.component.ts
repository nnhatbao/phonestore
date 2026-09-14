import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../proxy/payments';
import { ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  orderId = '';
  qrUrl = '';
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly paymentService: PaymentService,
    private readonly router: Router,
    private readonly toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    let rawId = this.route.snapshot.paramMap.get('orderId') || '';
    // Xóa bỏ hoàn toàn các dấu ngoặc kép thừa
    this.orderId = rawId.replace(/"/g, '').trim();

    if (this.orderId) {
      this.paymentService.getVietQrUrl(this.orderId).subscribe({
        next: (res: string) => {
          this.qrUrl = res;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
          console.error('Lỗi lấy mã QR:', err);
          this.toaster.error('Không thể tạo mã VietQR. Vui lòng kiểm tra lại đơn hàng!');
        },
      });
    } else {
      this.loading = false;
    }
  }

  onCompleted(): void {
    this.router.navigate(['/products']);
  }
}
