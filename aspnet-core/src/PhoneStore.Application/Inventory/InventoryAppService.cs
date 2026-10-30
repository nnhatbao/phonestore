using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using PhoneStore.Products;
using PhoneStore.Inventory.Dtos;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;

namespace PhoneStore.Inventory
{
    public class InventoryAppService : ApplicationService, IInventoryAppService
    {
        private readonly IRepository<ProductVariant, Guid> _variantRepository;
        private readonly IRepository<Product, Guid> _productRepository;
        private readonly IRepository<InventoryHistory, Guid> _inventoryHistoryRepository;

        // Giữ lại đúng 1 constructor duy nhất tiêm đủ các Repository cần thiết
        public InventoryAppService(
            IRepository<InventoryHistory, Guid> inventoryHistoryRepository,
            IRepository<ProductVariant, Guid> variantRepository,
            IRepository<Product, Guid> productRepository)
        {
            _inventoryHistoryRepository = inventoryHistoryRepository;
            _variantRepository = variantRepository;
            _productRepository = productRepository;
        }

        public async Task<PagedResultDto<InventoryItemDto>> GetListAsync(PagedAndSortedResultRequestDto input)
        {
            var variantQuery = await _variantRepository.GetQueryableAsync();
            var productQuery = await _productRepository.GetQueryableAsync();

            var query = from product in productQuery
                        join variant in variantQuery on product.Id equals variant.ProductId into variantGroup
                        from variant in variantGroup.DefaultIfEmpty()
                        select new InventoryItemDto
                        {
                            Id = variant != null ? variant.Id : product.Id,
                            ProductId = product.Id,
                            ProductName = product.Name,
                            VariantName = variant != null ? (!string.IsNullOrEmpty(variant.Color) ? variant.Color : "Mặc định") : "Chưa có phiên bản",
                            Sku = variant != null ? variant.Sku : "---",
                            Storage = variant != null ? variant.Storage : "---",
                            Price = variant != null ? variant.Price : 0,
                            StockCount = variant != null ? variant.StockCount : 0,
                            ImageUrl = string.Empty
                        };

            var totalCount = await AsyncExecuter.CountAsync(query);
            var items = await AsyncExecuter.ToListAsync(query.Skip(input.SkipCount).Take(input.MaxResultCount));

            return new PagedResultDto<InventoryItemDto>(totalCount, items);
        }

        public async Task<InventoryItemDto> UpdateStockAsync(Guid id, UpdateStockDto input)
        {
            var variant = await _variantRepository.FindAsync(id);
            Product product;

            if (variant == null)
            {
                product = await _productRepository.GetAsync(id);
                
                variant = new ProductVariant(
                    GuidGenerator.Create(),
                    product.Id,
                    input.Sku,
                    input.Color,
                    input.Storage,
                    input.Price,
                    input.StockCount
                );
                await _variantRepository.InsertAsync(variant, autoSave: true);
            }
            else
            {
                product = await _productRepository.GetAsync(variant.ProductId);

                variant.Color = input.Color;
                variant.Sku = input.Sku;
                variant.Storage = input.Storage;
                variant.Price = input.Price;
                variant.StockCount = input.StockCount;

                await _variantRepository.UpdateAsync(variant, autoSave: true);
            }

            return new InventoryItemDto
            {
                Id = variant.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                VariantName = variant.Color,
                Sku = variant.Sku,
                Price = variant.Price,
                StockCount = variant.StockCount,
                ImageUrl = string.Empty
            };
        }

        public async Task<InventoryItemDto> CreateAsync(CreateInventoryDto input)
        {
            var product = await _productRepository.GetAsync(input.ProductId);
            if (product == null)
            {
                throw new Volo.Abp.UserFriendlyException("Không tìm thấy sản phẩm cha tương ứng!");
            }

            var variant = new ProductVariant(
                GuidGenerator.Create(),
                input.ProductId,
                input.Sku,
                input.Color ?? "Tiêu chuẩn",
                input.Storage,
                input.Price,
                input.StockCount
            );

            await _variantRepository.InsertAsync(variant, autoSave: true);

            return new InventoryItemDto
            {
                Id = variant.Id,
                ProductId = product.Id,
                ProductName = product.Name,
                VariantName = variant.Color,
                Sku = variant.Sku,
                Storage = variant.Storage,
                Price = variant.Price,
                StockCount = variant.StockCount,
                ImageUrl = string.Empty
            };
        }

        public async Task<List<InventoryReportDto>> GetReportAsync(DateTime? fromDate, DateTime? toDate)
        {
            DateTime startDate = fromDate?.Date ?? DateTime.Today;
            DateTime endDate = toDate?.Date.AddDays(1).AddTicks(-1) ?? DateTime.Now;

            var variants = await _variantRepository.GetListAsync();
            var histories = await _inventoryHistoryRepository.GetListAsync();

            var reportData = new List<InventoryReportDto>();

            foreach (var variant in variants)
            {
                var vHistories = histories.Where(h => h.VariantId == variant.Id).ToList();

                // 1. Đầu kỳ = Mặc định 20 + Tổng lịch sử (IMPORT cộng, EXPORT trừ) trước ngày startDate
                int openingStock = 20 + vHistories
                    .Where(h => h.CreationTime < startDate)
                    .Sum(h => h.ChangeType == "IMPORT" ? h.QuantityChange : -h.QuantityChange);

                // 2. Tổng nhập trong ngày (IMPORT)
                int totalImport = vHistories
                    .Where(h => h.CreationTime >= startDate && h.CreationTime <= endDate && h.ChangeType == "IMPORT")
                    .Sum(h => h.QuantityChange);

                // 3. Tổng xuất trong ngày (EXPORT)
                int totalExport = vHistories
                    .Where(h => h.CreationTime >= startDate && h.CreationTime <= endDate && h.ChangeType == "EXPORT")
                    .Sum(h => h.QuantityChange);

                // 4. Cuối kỳ = Đầu kỳ + Tổng nhập - Tổng xuất
                int closingStock = openingStock + totalImport - totalExport;

                reportData.Add(new InventoryReportDto
                {
                    VariantId = variant.Id,
                    OpeningStock = openingStock,
                    TotalImport = totalImport,
                    TotalExport = totalExport,
                    ClosingStock = closingStock
                });
            }

            return reportData;
        }

        public async Task ImportStockAsync(Guid variantId, ImportStockInputDto input)
        {
            // Sử dụng _variantRepository để cập nhật tồn kho biến thể
            var variant = await _variantRepository.GetAsync(variantId);

            variant.StockCount += input.Quantity;
            await _variantRepository.UpdateAsync(variant);

            // Ghi lại lịch sử biến động kho
            await _inventoryHistoryRepository.InsertAsync(new InventoryHistory
            {
                VariantId = variantId,
                ChangeType = "IMPORT",
                QuantityChange = input.Quantity,
                Note = input.Note
            });
        }

        public async Task<List<InventoryHistoryDto>> GetHistoryAsync(Guid variantId)
        {
            var histories = await _inventoryHistoryRepository.GetListAsync(h => h.VariantId == variantId);
            return ObjectMapper.Map<List<InventoryHistory>, List<InventoryHistoryDto>>(histories);
        }
    }
}