using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace PhoneStore.Orders;

public class OrderDto : FullAuditedEntityDto<Guid>
{
    public string OrderId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int Status { get; set; }
    public string? PaymentMethod { get; set; } 
    public decimal TotalPrice { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto : EntityDto<Guid>
{
    public string ProductName { get; set; } = string.Empty;
    public string ProductThumbnail { get; set; } = string.Empty;
    public string Sku { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class UpdateOrderStatusDto
{
    public int Status { get; set; }
}
