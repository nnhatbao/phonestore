export interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  color: string;
  storage: string;
  price: number;
  thumbnailUrl?: string;
  quantity: number;
}
