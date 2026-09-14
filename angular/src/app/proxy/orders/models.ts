
export interface CreateOrderDto {
  customerName?: string;
  phoneNumber?: string;
  address?: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productVariantId?: string;
  productName?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
}
