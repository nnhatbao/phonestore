
export interface CreateInventoryDto {
  productId: string;
  productVariantId?: string;
  sku: string;
  storage?: string;
  color?: string;
  stockCount: number;
  price: number;
}
