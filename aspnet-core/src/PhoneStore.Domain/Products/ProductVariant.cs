using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace PhoneStore.Products
{
    public class ProductVariant : FullAuditedEntity<Guid>
    {
        public Guid ProductId { get; set; }
        public string Sku { get; set; }         // Ví dụ: IP15-128GB-BLU
        public string Color { get; set; }       // Ví dụ: Xanh dương, Titan tự nhiên
        public string Storage { get; set; }     // Ví dụ: 128GB, 256GB
        public decimal Price { get; set; }      // Giá niêm yết
        public decimal? SalePrice { get; set; } // Giá khuyến mãi (nếu có)
        public int StockCount { get; set; }     // Số lượng tồn kho

        protected ProductVariant() { }

        public ProductVariant(Guid id, Guid productId, string sku, string color, string storage, decimal price, int stockCount) : base(id)
        {
            ProductId = productId;
            Sku = sku;
            Color = color;
            Storage = storage;
            Price = price;
            StockCount = stockCount;
        }
    }
}