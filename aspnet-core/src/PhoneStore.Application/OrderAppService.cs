using System;
using System.Linq;
using System.Threading.Tasks;
using PhoneStore.Products;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PhoneStore.Orders
{
    public class OrderAppService : ApplicationService
    {
        private readonly IRepository<Order, Guid> _orderRepository;
        private readonly IRepository<ProductVariant, Guid> _variantRepository;

        public OrderAppService(
            IRepository<Order, Guid> orderRepository,
            IRepository<ProductVariant, Guid> variantRepository)
        {
            _orderRepository = orderRepository;
            _variantRepository = variantRepository;
        }

        public async Task<Guid> CreateAsync(CreateOrderDto input)
        {
            decimal total = input.Items.Sum(x => x.UnitPrice * x.Quantity);
            var order = new Order(GuidGenerator.Create(), input.CustomerName, input.PhoneNumber, input.Address, total);

            foreach (var item in input.Items)
            {
                // Trừ số lượng tồn kho (StockCount)
                var variant = await _variantRepository.GetAsync(item.ProductVariantId);
                if (variant.StockCount < item.Quantity)
                {
                    throw new Volo.Abp.UserFriendlyException($"Sản phẩm {item.ProductName} ({variant.Storage}) không đủ số lượng trong kho!");
                }
                variant.StockCount -= item.Quantity;
                await _variantRepository.UpdateAsync(variant);

                order.Items.Add(new OrderItem(
                    GuidGenerator.Create(),
                    item.ProductVariantId,
                    item.ProductName,
                    item.Sku,
                    item.UnitPrice,
                    item.Quantity
                ));
            }

            await _orderRepository.InsertAsync(order, autoSave: true);
            return order.Id;
        }
    }
}