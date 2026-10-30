
export interface InventoryReportDto {
  productId?: string;
  productName?: string;
  sku?: string;
  variantId?: string;
  openingStock: number;
  totalImport: number;
  totalExport: number;
  closingStock: number;
}
