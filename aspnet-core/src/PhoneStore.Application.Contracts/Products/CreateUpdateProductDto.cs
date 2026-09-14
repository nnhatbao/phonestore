using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace PhoneStore.Products
{
    public class CreateUpdateProductDto
    {
        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        [MaxLength(256)]
        public string Name { get; set; }

        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Chipset { get; set; }
        public string ScreenSize { get; set; }
        public int BatteryCapacity { get; set; }

        public List<CreateUpdateProductVariantDto> Variants { get; set; } = new();
    }

    public class CreateUpdateProductVariantDto
    {
        [Required]
        [MaxLength(64)]
        public string Sku { get; set; }

        [Required]
        public string Color { get; set; }

        [Required]
        public string Storage { get; set; }

        [Required]
        public decimal Price { get; set; }

        public decimal? SalePrice { get; set; }

        [Required]
        public int StockCount { get; set; }
    }
}