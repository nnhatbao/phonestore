import { Component, OnInit } from '@angular/core';
import { RestService, PagedResultDto } from '@abp/ng.core';
import { ProductService, ProductDto } from '../proxy/products';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

export interface CategoryItem {
  id: string;
  name: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  allProducts: ProductDto[] = [];
  filteredProducts: ProductDto[] = [];
  categories: CategoryItem[] = [];
  selectedCategoryId: string | null = null;
  loading = true;
  searchKeyword: string = '';

  constructor(
    private readonly productService: ProductService,
    private readonly rest: RestService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.route.queryParams.subscribe(params => {
      this.searchKeyword = params['q'] || '';
      this.applyFilter();
    });
  }

  loadCategories(): void {
    this.rest
      .request<any, PagedResultDto<CategoryItem>>({
        method: 'GET',
        url: '/api/app/category',
        params: { maxResultCount: 100 },
      })
      .subscribe({
        next: res => {
          this.categories = res?.items || [];
        },
        error: err => console.error('Lỗi tải danh mục:', err),
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getList({ maxResultCount: 100, skipCount: 0 }).subscribe({
      next: res => {
        this.allProducts = res.items || [];
        this.filterByCategory(this.selectedCategoryId);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error('Lỗi tải sản phẩm:', err);
      },
    });
  }
  applyFilter(): void {
    let result = [...this.allProducts];

    // Lọc theo danh mục đã chọn (nếu có)
    if (this.selectedCategoryId) {
      result = result.filter(p => p.categoryId === this.selectedCategoryId);
    }

    // Lọc theo từ khóa tìm kiếm (nếu có)
    if (this.searchKeyword.trim()) {
      const keyword = this.searchKeyword.toLowerCase().trim();
      result = result.filter(
        p => p.name?.toLowerCase().includes(keyword) || p.chipset?.toLowerCase().includes(keyword),
      );
    }

    this.filteredProducts = result;
  }
  selectCategory(categoryId: string | null): void {
    this.selectedCategoryId = categoryId;
    this.filterByCategory(categoryId);
    this.applyFilter();
  }

  filterByCategory(categoryId: string | null): void {
    if (!categoryId) {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter((p: any) => p.categoryId === categoryId);
    }
  }

  clearFilters(): void {
    this.selectedCategoryId = null;
    this.searchKeyword = '';
    this.router.navigate(['/products']);
  }

  getBrandLogo(name: string): string {
    const brand = (name || '').toLowerCase().trim();

    if (brand.includes('apple') || brand.includes('iphone')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/apple.svg';
    }
    if (brand.includes('samsung')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/samsung.svg';
    }
    if (brand.includes('xiaomi') || brand.includes('redmi')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/xiaomi.svg';
    }
    if (brand.includes('oppo')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/oppo.svg';
    }
    if (brand.includes('vivo')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vivo.svg';
    }
    if (brand.includes('realme')) {
      return 'assets/images/brands/realme.png';
    }
    if (brand.includes('google') || brand.includes('pixel')) {
      return 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/google.svg';
    }

    // Ảnh mặc định cho thương hiệu khác
    return '';
  }
}
