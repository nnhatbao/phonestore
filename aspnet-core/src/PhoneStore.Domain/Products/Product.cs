using System;
using System.Collections.Generic;
using Volo.Abp.Domain.Entities.Auditing;

namespace PhoneStore.Products
{
    public class Product : FullAuditedAggregateRoot<Guid>
    {
        public Guid CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }

        // Thông số kỹ thuật chung
        public string Chipset { get; set; }
        public string ScreenSize { get; set; }
        public int BatteryCapacity { get; set; } // mAh

        public ICollection<ProductVariant> Variants { get; set; }

        protected Product()
        {
            Variants = new List<ProductVariant>();
        }

        public Product(Guid id, Guid categoryId, string name, string description = null) : base(id)
        {
            CategoryId = categoryId;
            Name = name;
            Description = description;
            Variants = new List<ProductVariant>();
        }
    }
}