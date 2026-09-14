using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PhoneStore.Products
{
    public class ProductAppService : 
        CrudAppService<
            Product, 
            ProductDto, 
            Guid, 
            PagedAndSortedResultRequestDto, 
            CreateUpdateProductDto>, 
        IProductAppService
    {
        public ProductAppService(IRepository<Product, Guid> repository) 
            : base(repository)
        {
        }

        // Đảm bảo nạp kèm danh sách Variants khi lấy danh sách phân trang
        protected override async Task<IQueryable<Product>> CreateFilteredQueryAsync(PagedAndSortedResultRequestDto input)
        {
            return await Repository.WithDetailsAsync(x => x.Variants);
        }

        // Đảm bảo nạp kèm Variants khi gọi GetAsync(id) xem chi tiết
        protected override async Task<Product> GetEntityByIdAsync(Guid id)
        {
            var query = await Repository.WithDetailsAsync(x => x.Variants);
            return await AsyncExecuter.FirstOrDefaultAsync(query.Where(x => x.Id == id));
        }
    }
}