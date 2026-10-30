using AutoMapper;
using PhoneStore.Products;
using PhoneStore.Categories;
using PhoneStore.Orders;
using PhoneStore.Inventory;
using PhoneStore.Inventory.Dtos;

namespace PhoneStore;

public class PhoneStoreApplicationAutoMapperProfile : Profile
{
    public PhoneStoreApplicationAutoMapperProfile()
    {
        CreateMap<Product, ProductDto>();
            CreateMap<ProductVariant, ProductVariantDto>();
            CreateMap<Order, OrderDto>();
            CreateMap<OrderItem, OrderItemDto>();
            CreateMap<CreateOrderDto, Order>();
            CreateMap<CreateUpdateProductDto, Product>();
            CreateMap<CreateUpdateProductVariantDto, ProductVariant>();
            // Sử dụng alias hoặc namespace đầy đủ để tránh xung đột:
            CreateMap<PhoneStore.Categories.Category, PhoneStore.Categories.CategoryDto>();
            CreateMap<PhoneStore.Categories.CreateUpdateCategoryDto, PhoneStore.Categories.Category>();
            CreateMap<InventoryHistory, InventoryHistoryDto>();
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
    }
}
