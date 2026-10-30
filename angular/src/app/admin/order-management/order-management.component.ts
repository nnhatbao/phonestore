import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface OrderItem {
  productName: string;
  productThumbnail: string;
  quantity: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  creationTime: Date;
  status: number;
  paymentMethod: string;
  totalAmount: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit {
  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  selectedStatus: number | null = null;
  searchKeyword: string = '';
  selectedOrder: AdminOrder | null = null;
  isModalOpen = false;
  loading = false;

  // Đường dẫn API backend
  private readonly apiUrl = 'https://localhost:44337/api/app/order';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // 1. Tải danh sách đơn từ SQL Server
  loadOrders(): void {
    this.loading = true;
    this.http.get<any>(`${this.apiUrl}?maxResultCount=100`).subscribe({
      next: res => {
        this.orders = res.items || [];
        this.applyFilter();
        this.loading = false;
      },
      error: err => {
        console.error('Lỗi khi tải danh sách đơn:', err);
        this.loading = false;
      },
    });
  }

  // 2. Cập nhật trạng thái đơn và lưu vào SQL Server
  updateOrderStatus(order: AdminOrder, newStatus: number): void {
    this.http.put(`${this.apiUrl}/${order.id}/status`, { status: newStatus }).subscribe({
      next: () => {
        order.status = newStatus;
        this.applyFilter();
      },
      error: err => {
        alert('Cập nhật trạng thái thất bại! Vui lòng kiểm tra lại kết nối.');
        console.error(err);
      },
    });
  }

  filterByStatus(status: number | null): void {
    this.selectedStatus = status;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.orders];

    if (this.selectedStatus !== null) {
      result = result.filter(o => o.status === this.selectedStatus);
    }

    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase().trim();
      result = result.filter(
        o =>
          o.orderId?.toLowerCase().includes(kw) ||
          o.customerName?.toLowerCase().includes(kw) ||
          o.customerPhone?.includes(kw),
      );
    }

    this.filteredOrders = result;
  }

  viewDetail(order: AdminOrder): void {
    this.selectedOrder = order;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedOrder = null;
  }

  getStatusBadge(status: number): { text: string; css: string } {
    switch (status) {
      case 1:
        return { text: 'Chờ xác nhận', css: 'bg-warning text-dark' };
      case 2:
        return { text: 'Đang giao hàng', css: 'bg-info text-white' };
      case 3:
        return { text: 'Hoàn thành', css: 'bg-success text-white' };
      case 4:
        return { text: 'Đã hủy', css: 'bg-danger text-white' };
      default:
        return { text: 'Không rõ', css: 'bg-secondary text-white' };
    }
  }
}
