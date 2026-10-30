using System;
using Volo.Abp.Application.Dtos;
using System.ComponentModel.DataAnnotations;

namespace PhoneStore.Inventory
{
    public class InventoryItemDto : EntityDto<Guid>
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string VariantName { get; set; } // Hoặc tên thuộc tính/cấu hình của biến thể
        public string Sku { get; set; }
        public string Storage { get; set; } // Dung lượng lưu trữ (nếu có)
        public decimal Price { get; set; }
        public int StockCount { get; set; }
        public string ImageUrl { get; set; }
    }

    public class UpdateStockDto
    {
        [Required]
        public int StockCount { get; set; }
        public decimal Price { get; set; }
        [StringLength(50)]
        public string Color { get; set; } = string.Empty;
        [StringLength(50)]
        public string Sku { get; set; } = string.Empty;
        [StringLength(20)]
        public string Storage { get; set; } = string.Empty;
    }
}