import type { EntityDto, FullAuditedEntityDto } from '@abp/ng.core';

export interface CreateUpdateProductDto {
  categoryId: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  chipset?: string;
  screenSize?: string;
  batteryCapacity: number;
  variants: CreateUpdateProductVariantDto[];
}

export interface CreateUpdateProductVariantDto {
  sku: string;
  color: string;
  storage: string;
  price: number;
  salePrice?: number;
  stockCount: number;
}

export interface ProductDto extends FullAuditedEntityDto<string> {
  categoryId?: string;
  categoryName?: string;
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  chipset?: string;
  screenSize?: string;
  batteryCapacity: number;
  variants: ProductVariantDto[];
}

export interface ProductVariantDto extends EntityDto<string> {
  sku?: string;
  color?: string;
  storage?: string;
  price: number;
  salePrice?: number;
  stockCount: number;
}
