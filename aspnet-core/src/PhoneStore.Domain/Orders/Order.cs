using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;

namespace PhoneStore.Orders
{
    public enum OrderStatus
    {
        Pending = 1,
        Processing = 2,
        Completed = 3,
        Cancelled = 4
    }

    public class Order : FullAuditedAggregateRoot<Guid>
    {
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public decimal TotalPrice { get; set; }
        public OrderStatus Status { get; set; }
        public ICollection<OrderItem> Items { get; set; }

        protected Order()
        {
            Items = new List<OrderItem>();
        }

        public Order(Guid id, string customerName, string phoneNumber, string address, decimal totalPrice) : base(id)
        {
            CustomerName = customerName;
            PhoneNumber = phoneNumber;
            Address = address;
            TotalPrice = totalPrice;
            Status = OrderStatus.Pending;
            Items = new List<OrderItem>();
        }
    }
}