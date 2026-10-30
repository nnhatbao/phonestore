using System;

namespace PhoneStore.Inventory
{
    public class ImportStockInputDto
{
    public int Quantity { get; set; } // Số lượng nhập kho
    public string Note { get; set; } = string.Empty; // Ghi chú (ví dụ: Mã đơn hàng, lý do nhập kho)
}
}