import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading: boolean = false;

  private readonly apiUrl = 'https://localhost:44337/api/app/order';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}?maxResultCount=50`).subscribe({
      next: res => {
        // Lấy danh sách đơn từ SQL Server (PagedResultDto trả về items)
        this.orders = res.items || [];
        this.loading = false;
      },
      error: err => {
        console.error('Lỗi khi tải lịch sử đơn hàng:', err);
        this.loading = false;
      },
    });
  }

  // Chuyển đổi mã trạng thái số sang chữ hiển thị
  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Chờ xác nhận';
      case 2:
        return 'Đang giao hàng';
      case 3:
        return 'Hoàn thành';
      case 4:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }

  // Chuyển đổi mã trạng thái sang màu sắc badge
  getStatusBadge(status: number): string {
    switch (status) {
      case 1:
        return 'bg-warning text-dark';
      case 2:
        return 'bg-info text-white';
      case 3:
        return 'bg-success text-white';
      case 4:
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  }
  getProductLogo(productName: string, thumbnail?: string): string {
    if (thumbnail && thumbnail.startsWith('http')) {
      return thumbnail;
    }

    const name = (productName || '').toLowerCase();
    if (name.includes('xiaomi') || name.includes('redmi')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/xiaomi.svg';
    }
    if (name.includes('oppo')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/oppo.svg';
    }
    if (name.includes('samsung')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/samsung.svg';
    }
    if (name.includes('iphone') || name.includes('apple')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg';
    }
    if (name.includes('realme')) {
      return 'assets/images/brands/realme.png';
    }
    return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/android.svg';
  }

  // Tính tổng tiền nếu DB trả về 0
  getOrderTotal(order: any): number {
    if (order.totalAmount && order.totalAmount > 0) return order.totalAmount;
    if (order.total && order.total > 0) return order.total;
    if (order.items && order.items.length > 0) {
      return order.items.reduce(
        (sum: number, item: any) => sum + item.unitPrice * item.quantity,
        0,
      );
    }
    return 0;
  }
}
