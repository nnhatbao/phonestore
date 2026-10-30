import type { EntityDto, FullAuditedEntityDto } from '@abp/ng.core';

export interface CreateOrderDto {
  customerName?: string;
  phoneNumber?: string;
  address?: string;
  paymentMethod?: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productVariantId?: string;
  productName?: string;
  sku?: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderDto extends FullAuditedEntityDto<string> {
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;
  status: number;
  paymentMethod?: string;
  totalAmount: number;
  items: OrderItemDto[];
}

export interface OrderItemDto extends EntityDto<string> {
  productName?: string;
  productThumbnail?: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderStatusDto {
  status: number;
}
