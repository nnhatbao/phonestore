using System;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace PhoneStore.Orders;

public interface IOrderAppService : IApplicationService
{
    // Hàm tạo đơn hiện tại của bạn
    Task<OrderDto> CreateAsync(CreateOrderDto input);

    // Hàm lấy danh sách đơn cho Admin (GET)
    Task<PagedResultDto<OrderDto>> GetListAsync(PagedAndSortedResultRequestDto input);

    // Hàm cập nhật trạng thái đơn (PUT)
    Task<OrderDto> UpdateStatusAsync(Guid id, UpdateOrderStatusDto input);
}