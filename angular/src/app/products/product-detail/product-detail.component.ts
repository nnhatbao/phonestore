import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../proxy/products';
import { ProductDto, ProductVariantDto } from '../../proxy/products/models';
import { CartService } from '../../shared/services/cart.service';
import { ToasterService } from '@abp/ng.theme.shared';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product?: ProductDto;
  selectedVariant?: ProductVariantDto;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly toaster: ToasterService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.get(id).subscribe(res => {
        this.product = res;
        if (res.variants?.length) {
          this.selectedVariant = res.variants[0];
        }
      });
    }
  }

  onSelectVariant(variant: ProductVariantDto): void {
    this.selectedVariant = variant;
  }

  addToCart(): void {
    if (!this.product || !this.selectedVariant) return;

    this.cartService.addToCart({
      productId: this.product.id!,
      productName: this.product.name!,
      variantId: this.selectedVariant.id!,
      sku: this.selectedVariant.sku!,
      color: this.selectedVariant.color!,
      storage: this.selectedVariant.storage!,
      price: this.selectedVariant.salePrice || this.selectedVariant.price,
      thumbnailUrl: this.product.thumbnailUrl,
      quantity: 1,
    });

    this.toaster.success('Đã thêm sản phẩm vào giỏ hàng!');
  }
}
