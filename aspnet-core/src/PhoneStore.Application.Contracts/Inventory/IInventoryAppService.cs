using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using PhoneStore.Inventory.Dtos;

namespace PhoneStore.Inventory
{
    public interface IInventoryAppService : IApplicationService
    {
        // Lấy danh sách tồn kho có phân trang và tìm kiếm
        Task<PagedResultDto<InventoryItemDto>> GetListAsync(PagedAndSortedResultRequestDto input);

        // Cập nhật số lượng tồn kho cho một biến thể
        Task<InventoryItemDto> UpdateStockAsync(Guid id, UpdateStockDto input);
        Task<InventoryItemDto> CreateAsync(CreateInventoryDto input);
        Task<List<InventoryReportDto>> GetReportAsync(DateTime? fromDate, DateTime? toDate);
        Task ImportStockAsync(Guid variantId, ImportStockInputDto input);
        Task ResetStockAsync(Guid variantId);
        Task<List<InventoryHistoryDto>> GetHistoryAsync(Guid variantId);
        
    }
}