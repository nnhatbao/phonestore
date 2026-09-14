using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace PhoneStore.Products
{
    public interface IProductAppService : 
        ICrudAppService<
            ProductDto, 
            Guid, 
            PagedAndSortedResultRequestDto, 
            CreateUpdateProductDto>
    {
    }
}