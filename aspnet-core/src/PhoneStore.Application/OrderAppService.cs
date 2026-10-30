using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PhoneStore.Products;
using PhoneStore.Inventory;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PhoneStore.Orders
{
    public class OrderAppService : ApplicationService, IOrderAppService
    {
        private readonly IRepository<Order, Guid> _orderRepository;
        private readonly IRepository<ProductVariant, Guid> _variantRepository;
        private readonly IRepository<OrderItem, Guid> _orderItemRepository;
        private readonly IRepository<InventoryHistory, Guid> _inventoryHistoryRepository;

        public OrderAppService(
            IRepository<Order, Guid> orderRepository,
            IRepository<ProductVariant, Guid> variantRepository,
            IRepository<OrderItem, Guid> orderItemRepository,
            IRepository<InventoryHistory, Guid> inventoryHistoryRepository)
        {
            _orderRepository = orderRepository;
            _variantRepository = variantRepository;
            _orderItemRepository = orderItemRepository;
            _inventoryHistoryRepository = inventoryHistoryRepository;
        }

        // 1. TẠO ĐƠN HÀNG (Khách đặt hàng)
        public async Task<OrderDto> CreateAsync(CreateOrderDto input)
        {
            decimal total = input.Items.Sum(x => x.UnitPrice * x.Quantity);
            var order = new Order(GuidGenerator.Create(), input.CustomerName, input.PhoneNumber, input.Address, total);
            order.PaymentMethod = input.PaymentMethod;
            order.TotalPrice = total;

            foreach (var item in input.Items)
            {
                var variant = await _variantRepository.GetAsync(item.ProductVariantId);
                if (variant.StockCount < item.Quantity)
                {
                    throw new Volo.Abp.UserFriendlyException($"Sản phẩm {item.ProductName} ({variant.Storage}) không đủ số lượng trong kho!");
                }
                
                // Trừ số lượng tồn kho (StockCount) khi đặt hàng
                variant.StockCount -= item.Quantity;
                await _variantRepository.UpdateAsync(variant, autoSave: true);

                order.Items.Add(new OrderItem(
                    GuidGenerator.Create(),
                    item.ProductVariantId,
                    item.ProductName,
                    variant.Sku,
                    item.UnitPrice,
                    item.Quantity
                ));
            }

            await _orderRepository.InsertAsync(order, autoSave: true);
            return ObjectMapper.Map<Order, OrderDto>(order);
        }

        // 2. LẤY DANH SÁCH ĐƠN HÀNG CHO ADMIN (GET)
        public async Task<PagedResultDto<OrderDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var queryable = await _orderRepository.WithDetailsAsync(x => x.Items);
            var totalCount = await AsyncExecuter.CountAsync(queryable);

            var pagedQuery = queryable
                .OrderByDescending(x => x.CreationTime)
                .Skip(input.SkipCount)
                .Take(input.MaxResultCount);

            var orders = await AsyncExecuter.ToListAsync(pagedQuery);

            return new PagedResultDto<OrderDto>(
                totalCount,
                ObjectMapper.Map<List<Order>, List<OrderDto>>(orders)
            );
        }

        // 3. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (PUT)
        public async Task<OrderDto> UpdateStatusAsync(Guid id, UpdateOrderStatusDto input)
        {
            var newStatus = (OrderStatus)input.Status;
            var order = await _orderRepository.GetAsync(id);
            if (order == null)
            {
                throw new Volo.Abp.UserFriendlyException("Không tìm thấy đơn hàng!");
            }

            var oldStatus = order.Status;
            Console.WriteLine($"=== [DEBUG] Order ID: {id} | OldStatus: {oldStatus} | NewStatus: {newStatus} ===");

            // A. Xử lý khi đơn hàng chuyển sang HỦY -> Hoàn lại tồn kho
            if (oldStatus != OrderStatus.Cancelled && newStatus == OrderStatus.Cancelled)
            {
                Console.WriteLine("=== [DEBUG] Đã vào điều kiện HỦY ĐƠN ===");
                var orderItems = await _orderItemRepository.GetListAsync(x => x.OrderId == id);
                if (orderItems != null && orderItems.Any())
                {
                    foreach (var item in orderItems)
                    {
                        var variant = await _variantRepository.GetAsync(item.ProductVariantId);
                        if (variant != null)
                        {
                            variant.StockCount += item.Quantity;
                            await _variantRepository.UpdateAsync(variant, autoSave: true);
                        }
                    }
                }
            }

            // B. Xử lý khi đơn hàng chuyển sang HOÀN THÀNH -> Ghi log EXPORT (Xuất kho)
            if (oldStatus != OrderStatus.Completed && newStatus == OrderStatus.Completed)
            {
                Console.WriteLine("=== [DEBUG] Đã vào điều kiện HOÀN THÀNH ĐƠN HÀNG ===");
                
                var orderItems = await _orderItemRepository.GetListAsync(x => x.OrderId == id);
                Console.WriteLine($"=== [DEBUG] Số lượng items tìm thấy trong đơn: {orderItems?.Count ?? 0} ===");

                if (orderItems != null && orderItems.Any())
                {
                    foreach (var item in orderItems)
                    {
                        Console.WriteLine($"=== [DEBUG] Đang ghi log EXPORT cho VariantId: {item.ProductVariantId} với số lượng: {item.Quantity} ===");
                        
                        await _inventoryHistoryRepository.InsertAsync(new InventoryHistory
                        {
                            VariantId = item.ProductVariantId,
                            ChangeType = "EXPORT",
                            QuantityChange = item.Quantity,
                            Note = $"Xuất kho cho đơn hàng hoàn thành #{order.Id} (Khách: {order.CustomerName})"
                        }, autoSave: true);

                        Console.WriteLine("=== [DEBUG] Đã insert thành công log EXPORT vào database! ===");
                    }
                }
                else
                {
                    Console.WriteLine("=== [DEBUG WARNING] Không tìm thấy OrderItem nào cho đơn hàng này! ===");
                }
            }

            order.Status = newStatus;
            await _orderRepository.UpdateAsync(order, autoSave: true);

            return ObjectMapper.Map<Order, OrderDto>(order);
        }
    }
}