using System;

namespace PhoneStore.Inventory.Dtos
{
    public class InventoryReportDto
    {
        public Guid ProductId { get; set; }
        public string ProductName { get; set; }
        public string Sku { get; set; }
        public Guid VariantId { get; set; }
        
        // Các chỉ số báo cáo X - N - T
        public int OpeningStock { get; set; }   // Tồn đầu kỳ
        public int TotalImport { get; set; }    // Tổng nhập trong kỳ
        public int TotalExport { get; set; }    // Tổng xuất trong kỳ
        
        // Cuối kỳ = Đầu kỳ + Nhập - Xuất
        public int ClosingStock { get; set; }
    }
}