using System;

namespace PhoneStore.Inventory
{
    public class InventoryHistoryDto
    {
        public DateTime CreationTime { get; set; }
        public string ChangeType { get; set; } = string.Empty; // Loại biến động: "IMPORT" (Nhập), "EXPORT" (Xuất bán), "RESTORE" (Hoàn kho)
        public int QuantityChange { get; set; } // Số lượng thay đổi (+ hoặc -)
        public string Note { get; set; } = string.Empty; // Ghi chú (ví dụ: Mã đơn hàng, lý do cập nhật)
    }
}