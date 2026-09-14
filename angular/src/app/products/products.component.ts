import { Component, OnInit } from '@angular/core';
import { ListService, PagedResultDto } from '@abp/ng.core';
import { ProductService } from '../proxy/products';
import { ProductDto } from '../proxy/products/models';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  providers: [ListService], // Khai báo ListService tại đây
})
export class ProductsComponent implements OnInit {
  products = { items: [] as ProductDto[], totalCount: 0 } as PagedResultDto<ProductDto>;

  constructor(
    public readonly list: ListService,
    private readonly productService: ProductService,
  ) {}

  ngOnInit(): void {
    const productStreamCreator = (query: any) => this.productService.getList(query);

    this.list.hookToQuery(productStreamCreator).subscribe(response => {
      this.products = response;
    });
  }
}
