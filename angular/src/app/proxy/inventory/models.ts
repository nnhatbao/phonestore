import type { EntityDto } from '@abp/ng.core';

export interface ImportStockInputDto {
  quantity: number;
  note?: string;
}

export interface InventoryHistoryDto {
  creationTime?: string;
  changeType?: string;
  quantityChange: number;
  note?: string;
}

export interface InventoryItemDto extends EntityDto<string> {
  productId?: string;
  productName?: string;
  variantName?: string;
  sku?: string;
  storage?: string;
  price: number;
  stockCount: number;
  imageUrl?: string;
}

export interface UpdateStockDto {
  stockCount: number;
  price: number;
  color?: string;
  sku?: string;
  storage?: string;
}
