import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListService, PagedResultDto, RestService } from '@abp/ng.core';
import { ConfirmationService, Confirmation, ToasterService } from '@abp/ng.theme.shared';

export interface CategoryDto {
  id: string;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-category-management',
  templateUrl: './category-management.component.html',
  providers: [ListService],
})
export class CategoryManagementComponent implements OnInit {
  categories = { items: [], totalCount: 0 } as PagedResultDto<CategoryDto>;
  isModalOpen = false;
  form!: FormGroup;
  selectedCategory = {} as CategoryDto;

  constructor(
    public readonly list: ListService,
    private readonly rest: RestService,
    private readonly confirmation: ConfirmationService,
    private readonly fb: FormBuilder,
    private readonly toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    const streamCreator = (query: any) =>
      this.rest.request<any, PagedResultDto<CategoryDto>>({
        method: 'GET',
        url: '/api/app/category',
        params: query,
      });

    this.list.hookToQuery(streamCreator).subscribe(response => {
      this.categories = response;
    });
  }

  createCategory(): void {
    this.selectedCategory = {} as CategoryDto;
    this.buildForm();
    this.isModalOpen = true;
  }

  editCategory(item: CategoryDto): void {
    this.selectedCategory = item;
    this.buildForm();
    this.isModalOpen = true;
  }

  buildForm(): void {
    this.form = this.fb.group({
      name: [this.selectedCategory.name || '', Validators.required],
      description: [this.selectedCategory.description || ''],
    });
  }

  save(): void {
    if (this.form.invalid) return;

    const request = this.selectedCategory.id
      ? this.rest.request({
          method: 'PUT',
          url: `/api/app/category/${this.selectedCategory.id}`,
          body: this.form.value,
        })
      : this.rest.request({
          method: 'POST',
          url: '/api/app/category',
          body: this.form.value,
        });

    request.subscribe({
      next: () => {
        this.isModalOpen = false;
        this.list.get();
        this.toaster.success('Thao tác danh mục thành công!');
      },
      error: err => this.toaster.error(err?.error?.message || 'Có lỗi xảy ra!'),
    });
  }

  deleteCategory(id: string): void {
    this.confirmation
      .warn(
        'Bạn có chắc muốn xóa danh mục này? Tất cả sản phẩm thuộc danh mục có thể bị ảnh hưởng.',
        'Xác nhận xóa',
      )
      .subscribe((status: Confirmation.Status) => {
        if (status === Confirmation.Status.confirm) {
          this.rest
            .request({
              method: 'DELETE',
              url: `/api/app/category/${id}`,
            })
            .subscribe({
              next: () => {
                this.list.get();
                this.toaster.success('Đã xóa danh mục thành công!');
              },
              error: err =>
                this.toaster.error(err?.error?.message || 'Không thể xóa danh mục này!'),
            });
        }
      });
  }
}
