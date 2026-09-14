using AutoMapper;
using PhoneStore.Products;

namespace PhoneStore;

public class PhoneStoreApplicationAutoMapperProfile : Profile
{
    public PhoneStoreApplicationAutoMapperProfile()
    {
        CreateMap<Product, ProductDto>();
            CreateMap<ProductVariant, ProductVariantDto>();

            CreateMap<CreateUpdateProductDto, Product>();
            CreateMap<CreateUpdateProductVariantDto, ProductVariant>();
        /* You can configure your AutoMapper mapping configuration here.
         * Alternatively, you can split your mapping configurations
         * into multiple profile classes for a better organization. */
    }
}
