import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  orderId = '';
  displayOrderCode: string = '';
  totalAmount = 0;
  qrCodeUrl = '';

  // Cấu hình tài khoản ngân hàng nhận tiền
  readonly BANK_ID = 'MB'; // Mã ngân hàng: MB, VCB, ACB, ICB (VietinBank),...
  readonly ACCOUNT_NO = '0859040056'; // Số tài khoản MB của bạn
  readonly ACCOUNT_NAME = 'NGUYEN NHAT BAO'; // Tên chủ tài khoản

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rest: RestService,
    private readonly toaster: ToasterService,
    private readonly router: Router,
  ) {
    // 1. Lấy số tiền từ Router State (nếu chuyển hướng trực tiếp từ Cart)
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['totalAmount']) {
      this.totalAmount = nav.extras.state['totalAmount'];
    }
  }

  ngOnInit(): void {
    // 1. Lấy param từ URL
    let rawId = this.route.snapshot.paramMap.get('id') || this.route.snapshot.params['id'] || '';
    const codeParam = this.route.snapshot.queryParams['code'];
    const amountParam = this.route.snapshot.queryParams['amount'];

    if (amountParam) {
      this.totalAmount = Number(amountParam);
    }

    // 2. Xử lý giải mã chuỗi JSON nếu param bị lỗi dính JSON
    if (rawId.includes('{') || rawId.includes('%7B')) {
      try {
        const decoded = decodeURIComponent(rawId);
        const parsed = JSON.parse(decoded);
        this.orderId = parsed.id || '';
        this.displayOrderCode =
          parsed.orderCode || (this.orderId ? this.orderId.substring(0, 8).toUpperCase() : '');
      } catch (e) {
        const match = rawId.match(
          /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/,
        );
        this.orderId = match ? match[0] : '';
        this.displayOrderCode = this.orderId ? this.orderId.substring(0, 8).toUpperCase() : '';
      }
    } else {
      this.orderId = rawId;
      this.displayOrderCode = codeParam || (rawId ? rawId.substring(0, 8).toUpperCase() : '');
    }

    // 3. Fallback mã hiển thị đẹp mắt
    if (
      !this.displayOrderCode ||
      this.displayOrderCode.includes('{') ||
      this.displayOrderCode.includes('"')
    ) {
      this.displayOrderCode = this.orderId
        ? this.orderId.substring(0, 8).toUpperCase()
        : 'PS' + Math.floor(10000 + Math.random() * 90000);
    }

    // 4. KÍCH HOẠT TẠO MÃ QR (Dòng này giúp hiển thị khung ảnh QR)
    this.generateQrCode(this.totalAmount);
  }

  generateQrCode(amount: number): void {
    const memo = encodeURIComponent(`DH ${this.displayOrderCode}`);
    const accountName = encodeURIComponent(this.ACCOUNT_NAME);
    this.qrCodeUrl = `https://img.vietqr.io/image/${this.BANK_ID}-${this.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${accountName}`;
  }
}
