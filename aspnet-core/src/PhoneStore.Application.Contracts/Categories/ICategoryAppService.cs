using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace PhoneStore.Categories
{
    public interface ICategoryAppService : 
        ICrudAppService<
            CategoryDto, 
            Guid, 
            PagedAndSortedResultRequestDto, 
            CreateUpdateCategoryDto>
    {
    }
}