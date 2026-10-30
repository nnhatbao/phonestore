using System;
using System.ComponentModel.DataAnnotations;

public class CreateInventoryDto
{
    [Required]
    public Guid ProductId { get; set; } // ID sản phẩm chính

    public Guid? ProductVariantId { get; set; } // ID biến thể (nếu có)

    [Required]
    [StringLength(50)]
    public string Sku { get; set; } = string.Empty; // Mã SKU của biến thể

    [StringLength(20)]
    public string Storage { get; set; } = string.Empty; // Dung lượng lưu trữ (nếu có)

    [StringLength(50)]
    public string Color { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int StockCount { get; set; } // Số lượng tồn kho ban đầu

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; } // Giá bán
}