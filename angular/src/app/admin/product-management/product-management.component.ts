import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, RestService } from '@abp/ng.core';
import { ConfirmationService, Confirmation, ToasterService } from '@abp/ng.theme.shared';
import { ProductService, ProductDto } from '../../proxy/products';

interface CategoryLookupDto {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  providers: [ListService],
})
export class ProductManagementComponent implements OnInit {
  products = { items: [], totalCount: 0 } as PagedResultDto<ProductDto>;
  categories: CategoryLookupDto[] = [];
  isModalOpen = false;
  form!: FormGroup;
  selectedProduct = {} as ProductDto;
  selectedVariantId: string | null = null;

  constructor(
    public readonly list: ListService,
    private readonly productService: ProductService,
    private readonly rest: RestService,
    private readonly confirmation: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    const productStreamCreator = (query: any) => this.productService.getList(query);
    this.list.hookToQuery(productStreamCreator).subscribe(response => {
      this.products = response;
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.rest
      .request<any, PagedResultDto<CategoryLookupDto>>({
        method: 'GET',
        url: '/api/app/category',
        params: { maxResultCount: 100 },
      })
      .subscribe((res: PagedResultDto<CategoryLookupDto>) => {
        this.categories = res?.items || [];
      });
  }

  createProduct(): void {
    this.selectedProduct = {} as ProductDto;
    this.selectedVariantId = null;
    this.buildForm();
    this.isModalOpen = true;
  }

  editProduct(item: ProductDto): void {
    this.selectedProduct = item;
    const defaultVariant = item.variants?.[0];
    this.selectedVariantId = defaultVariant?.id || null;
    this.buildForm();
    this.isModalOpen = true;
  }

  buildForm(): void {
    const defaultVariant = this.selectedProduct.variants?.[0];
    this.form = this.fb.group({
      name: [this.selectedProduct.name || '', Validators.required],
      categoryId: [this.selectedProduct.categoryId || '', Validators.required],
      description: [this.selectedProduct.description || ''],
      thumbnailUrl: [this.selectedProduct.thumbnailUrl || '', Validators.required],
      chipset: [this.selectedProduct.chipset || ''],
      screenSize: [this.selectedProduct.screenSize || ''],
      batteryCapacity: [this.selectedProduct.batteryCapacity || null],
      variantColor: [defaultVariant?.color || 'Đen', Validators.required],
      variantStorage: [defaultVariant?.storage || '128GB', Validators.required],
      variantPrice: [defaultVariant?.price || 10000000, [Validators.required, Validators.min(0)]],
      variantStock: [defaultVariant?.stockCount || 10, [Validators.required, Validators.min(1)]],
    });
  }

  save(): void {
    if (this.form.invalid) return;
    const val = this.form.value;

    const payload: any = {
      name: val.name,
      description: val.description,
      thumbnailUrl: val.thumbnailUrl,
      chipset: val.chipset,
      screenSize: val.screenSize,
      batteryCapacity: val.batteryCapacity,
      categoryId: val.categoryId,
      variants: [
        {
          id: this.selectedVariantId,
          sku: `${val.name.replace(/\s+/g, '')}-${val.variantStorage}`,
          color: val.variantColor,
          storage: val.variantStorage,
          price: val.variantPrice,
          stockCount: val.variantStock,
        },
      ],
    };

    const request = this.selectedProduct.id
      ? this.productService.update(this.selectedProduct.id, payload)
      : this.productService.create(payload);

    request.subscribe({
      next: () => {
        this.isModalOpen = false;
        this.list.get();
        this.toaster.success('Lưu sản phẩm thành công!');
      },
      error: err => this.toaster.error(err?.error?.message || 'Có lỗi xảy ra!'),
    });
  }

  deleteProduct(id: string): void {
    this.confirmation
      .warn('Bạn có chắc chắn muốn xóa sản phẩm này?', 'Xác nhận xóa')
      .subscribe((status: Confirmation.Status) => {
        if (status === Confirmation.Status.confirm) {
          this.productService.delete(id).subscribe(() => {
            this.list.get();
            this.toaster.success('Đã xóa sản phẩm!');
          });
        }
      });
  }
}
