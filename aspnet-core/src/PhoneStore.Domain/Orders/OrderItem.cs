using System;
using Volo.Abp.Domain.Entities;

namespace PhoneStore.Orders
{
    public class OrderItem : Entity<Guid>
    {
        public Guid OrderId { get; set; }
        public Guid ProductVariantId { get; set; }
        public string ProductName { get; set; }
        public string Sku { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }

        protected OrderItem() { }

        public OrderItem(Guid id, Guid productVariantId, string productName, string sku, decimal unitPrice, int quantity) : base(id)
        {
            ProductVariantId = productVariantId;
            ProductName = productName;
            Sku = sku;
            UnitPrice = unitPrice;
            Quantity = quantity;
        }
    }
}