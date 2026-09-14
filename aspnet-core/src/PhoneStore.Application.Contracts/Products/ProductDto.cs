using System;
using System.Collections.Generic;
using Volo.Abp.Application.Dtos;

namespace PhoneStore.Products
{
    public class ProductDto : FullAuditedEntityDto<Guid>
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ThumbnailUrl { get; set; }
        public string Chipset { get; set; }
        public string ScreenSize { get; set; }
        public int BatteryCapacity { get; set; }
        public List<ProductVariantDto> Variants { get; set; }
    }

    public class ProductVariantDto : EntityDto<Guid>
    {
        public string Sku { get; set; }
        public string Color { get; set; }
        public string Storage { get; set; }
        public decimal Price { get; set; }
        public decimal? SalePrice { get; set; }
        public int StockCount { get; set; }
    }
}