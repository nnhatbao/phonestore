import { Component, OnInit } from '@angular/core';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { InventoryItemDto, UpdateStockDto } from '../../proxy/inventory/models';
import { InventoryService } from '../../proxy/inventory/inventory.service';
import { CategoryService } from '../../proxy/categories/category.service';
import { ProductService } from '../../proxy/products/product.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
})
export class InventoryComponent implements OnInit {
  inventoryList: InventoryItemDto[] = [];
  totalCount = 0;
  listQuery: PagedAndSortedResultRequestDto = { skipCount: 0, maxResultCount: 50 };

  // Modal cập nhật tồn kho & báo cáo kho
  isModalOpen = false;
  selectedItem: InventoryItemDto | null = null;
  newStockCount = 0;
  updatePrice = 0;

  // Thông số báo cáo X - N - T cho item được chọn
  selectedItemReport: any = {
    openingStock: 0,
    totalImport: 0,
    totalExport: 0,
    closingStock: 0,
  };

  // Modal thêm mới tồn kho
  isCreateModalOpen = false;
  categories: any[] = [];
  products: any[] = [];
  filteredProducts: any[] = [];
  selectedCategoryId = '';

  newInventory: any = {
    productId: '',
    color: '',
    sku: '',
    storage: '',
    stockCount: 0,
    price: 0,
  };

  updateColor = '';
  updateSku = '';
  updateStorage = ''; // Dung lượng lưu trữ
  inventoryHistory: any[] = []; // Dữ liệu lịch sử kho

  // Biến phục vụ tính năng Nhập tồn nhanh
  importQuantity = 0;
  importNote = '';

  constructor(
    private inventoryService: InventoryService,
    private categoryService: CategoryService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory(): void {
    this.inventoryService.getList(this.listQuery).subscribe((res: any) => {
      this.inventoryList = res.items;
      this.totalCount = res.totalCount;
    });
  }

  // Mở modal thêm mới: load danh mục và sản phẩm
  openCreateModal(): void {
    this.newInventory = { productId: '', color: '', sku: '', storage: '', stockCount: 0, price: 0 };
    this.selectedCategoryId = '';
    this.filteredProducts = [];
    this.isCreateModalOpen = true;

    // Lấy danh sách danh mục
    this.categoryService.getList({ maxResultCount: 100 } as any).subscribe((res: any) => {
      this.categories = res.items;
    });

    // Lấy danh sách sản phẩm
    this.productService.getList({ maxResultCount: 100 } as any).subscribe((res: any) => {
      this.products = res.items;
    });
  }

  // Xử lý khi thay đổi danh mục -> lọc ra sản phẩm tương ứng
  onCategoryChange(): void {
    this.filteredProducts = this.products.filter(p => p.categoryId === this.selectedCategoryId);
    this.newInventory.productId = '';
  }

  saveCreate(): void {
    this.inventoryService.create(this.newInventory).subscribe(() => {
      this.isCreateModalOpen = false;
      this.loadInventory();
    });
  }

  // Mở modal cập nhật kho & tải báo cáo X-N-T / lịch sử của biến thể
  openUpdateModal(item: InventoryItemDto): void {
    this.selectedItem = item;
    this.newStockCount = item.stockCount;
    this.updatePrice = item.price;

    this.updateColor =
      item.variantName && item.variantName !== 'Chưa phân loại' ? item.variantName : '';
    this.updateSku = item.sku && item.sku !== '---' ? item.sku : '';
    this.updateStorage = item.storage && item.storage !== '---' ? item.storage : '';

    // Reset form nhập tồn nhanh
    this.importQuantity = 0;
    this.importNote = '';

    this.isModalOpen = true;

    // Gọi API lấy báo cáo và lịch sử kho thực tế dựa vào item.id
    this.loadInventoryReportAndHistory(item.id!);
  }

  loadInventoryReportAndHistory(variantId: string): void {
    // Thiết lập mốc thời gian từ đầu ngày hiện tại để tính X-N-T chuẩn theo ngày
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const fromDate = todayStart.toISOString();
    const toDate = new Date().toISOString();

    // 1. Lấy báo cáo X-N-T
    this.inventoryService.getReport(fromDate, toDate).subscribe((reports: any[]) => {
      const currentReport = reports?.find(r => r.variantId === variantId);
      if (currentReport) {
        this.selectedItemReport = currentReport;
      } else {
        this.selectedItemReport = {
          openingStock: 20, // Mặc định đầu kỳ là 20 nếu chưa có phát sinh
          totalImport: 0,
          totalExport: 0,
          closingStock: 20,
        };
      }
    });

    // 2. Lấy lịch sử biến động kho thực tế từ Backend (Hiển thị cả IMPORT và EXPORT)
    this.inventoryService.getHistory(variantId).subscribe((history: any[]) => {
      this.inventoryHistory = history;
    });
  }

  // Xử lý hành động Nhập tồn nhanh
  importStock(): void {
    if (!this.selectedItem || !this.selectedItem.id || this.importQuantity <= 0) {
      alert('Vui lòng nhập số lượng hợp lệ!');
      return;
    }

    const input = {
      quantity: this.importQuantity,
      note: this.importNote || 'Nhập thêm hàng vào kho',
    };

    const addedQty = this.importQuantity;

    this.inventoryService.importStock(this.selectedItem.id!, input as any).subscribe(() => {
      // Cập nhật ngay lập tức số lượng tồn trên item và ô hiển thị thực tế
      if (this.selectedItem) {
        this.selectedItem.stockCount += addedQty;
        this.newStockCount = this.selectedItem.stockCount;
      }

      this.importQuantity = 0;
      this.importNote = '';

      // Tải lại danh sách kho ngoài màn hình chính và làm mới báo cáo/lịch sử trong modal
      this.loadInventory();
      this.loadInventoryReportAndHistory(this.selectedItem!.id!);
    });
  }

  saveStock(): void {
    if (!this.selectedItem || !this.selectedItem.id) return;

    const input = {
      stockCount: this.newStockCount,
      price: this.updatePrice,
      color: this.updateColor,
      sku: this.updateSku,
      storage: this.updateStorage,
    };

    this.inventoryService.updateStock(this.selectedItem.id!, input as any).subscribe(() => {
      this.isModalOpen = false;
      this.loadInventory();
    });
  }
  onResetStock(variantId: string) {
    if (confirm('Bạn có chắc chắn muốn xóa sạch tồn kho của sản phẩm này (đưa về 0)?')) {
      this.inventoryService.resetStock(variantId).subscribe({
        next: () => {
          // Thông báo thành công (nếu có toast/notify)
          // Load lại danh sách kho
          this.loadInventory();
        },
        error: err => {
          console.error('Lỗi khi reset kho:', err);
        },
      });
    }
  }
}
