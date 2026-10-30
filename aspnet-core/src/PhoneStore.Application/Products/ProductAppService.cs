using System;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using PhoneStore.Permissions;

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
            //Xem sản phẩm: Cho phép tất cả mọi người (kể cả khách vãng lai và user)
            GetPolicyName = null;
            GetListPolicyName = null;

            //Thao tác quản lý: Chỉ ai có quyền tương ứng mới được gọi API
            CreatePolicyName = PhoneStorePermissions.Products.Create;
            UpdatePolicyName = PhoneStorePermissions.Products.Edit;
            DeletePolicyName = PhoneStorePermissions.Products.Delete;
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