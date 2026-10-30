using System;
using Volo.Abp.Domain.Entities.Auditing;

namespace PhoneStore.Inventory
{
    public class InventoryHistory : AuditedAggregateRoot<Guid>
    {
        public Guid VariantId { get; set; } // Liên kết với biến thể sản phẩm (ProductVariant)
        public string ChangeType { get; set; } = string.Empty; // Loại biến động: "IMPORT" (Nhập), "EXPORT" (Xuất bán), "RESTORE" (Hoàn kho)
        public int QuantityChange { get; set; } // Số lượng thay đổi (+ hoặc -)
        public int StockAfter { get; set; } // Tồn kho thực tế sau khi thay đổi
        public string Note { get; set; } = string.Empty; // Ghi chú (ví dụ: Mã đơn hàng, lý do cập nhật)
    }
}