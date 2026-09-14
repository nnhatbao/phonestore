using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using PhoneStore.Products;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Guids;

namespace PhoneStore.Data
{
    public class PhoneStoreDataSeederContributor : IDataSeedContributor, ITransientDependency
    {
        private readonly IRepository<Category, Guid> _categoryRepository;
        private readonly IRepository<Product, Guid> _productRepository;
        private readonly IGuidGenerator _guidGenerator;

        public PhoneStoreDataSeederContributor(
            IRepository<Category, Guid> categoryRepository,
            IRepository<Product, Guid> productRepository,
            IGuidGenerator guidGenerator)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
            _guidGenerator = guidGenerator;
        }

        public async Task SeedAsync(DataSeedContext context)
        {
            // Nếu đã có dữ liệu danh mục thì bỏ qua, tránh tạo trùng lặp
            if (await _categoryRepository.GetCountAsync() > 0)
            {
                return;
            }

            // 1. Tạo danh mục hãng
            var appleCategory = new Category(
                _guidGenerator.Create(),
                "Apple",
                "Các dòng sản phẩm iPhone chính hãng VN/A"
            );
            var samsungCategory = new Category(
                _guidGenerator.Create(),
                "Samsung",
                "Các dòng điện thoại thông minh Galaxy"
            );

            await _categoryRepository.InsertAsync(appleCategory, autoSave: true);
            await _categoryRepository.InsertAsync(samsungCategory, autoSave: true);

            // 2. Tạo sản phẩm: iPhone 15 Pro Max
            var iphone15 = new Product(
                _guidGenerator.Create(),
                appleCategory.Id,
                "iPhone 15 Pro Max",
                "Khung viền titan siêu nhẹ, chip Apple A17 Pro mạnh mẽ và cổng sạc USB-C."
            )
            {
                ThumbnailUrl = "https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg",
                Chipset = "Apple A17 Pro (3 nm)",
                ScreenSize = "6.7 inch OLED Super Retina XDR",
                BatteryCapacity = 4422,
                Variants = new List<ProductVariant>
                {
                    new ProductVariant(
                        _guidGenerator.Create(),
                        Guid.Empty,
                        "IP15PM-256-BLU",
                        "Titan Xanh",
                        "256GB",
                        29990000m,
                        50
                    ),
                    new ProductVariant(
                        _guidGenerator.Create(),
                        Guid.Empty,
                        "IP15PM-512-NAT",
                        "Titan Tự Nhiên",
                        "512GB",
                        35990000m,
                        25
                    )
                }
            };

            // 3. Tạo sản phẩm: Samsung Galaxy S24 Ultra
            var samsungS24 = new Product(
                _guidGenerator.Create(),
                samsungCategory.Id,
                "Samsung Galaxy S24 Ultra",
                "Tích hợp quyền năng Galaxy AI, camera zoom 100x và khung viền titan bền bỉ."
            )
            {
                ThumbnailUrl = "https://cdn.tgdd.vn/Products/Images/42/307174/samsung-galaxy-s24-ultra-grey-thumbnew-600x600.jpg",
                Chipset = "Snapdragon 8 Gen 3 for Galaxy",
                ScreenSize = "6.8 inch Dynamic AMOLED 2X",
                BatteryCapacity = 5000,
                Variants = new List<ProductVariant>
                {
                    new ProductVariant(
                        _guidGenerator.Create(),
                        Guid.Empty,
                        "S24U-256-GRY",
                        "Xám Titan",
                        "256GB",
                        28990000m,
                        40
                    ),
                    new ProductVariant(
                        _guidGenerator.Create(),
                        Guid.Empty,
                        "S24U-512-BLK",
                        "Đen Titan",
                        "512GB",
                        33490000m,
                        20
                    )
                }
            };

            await _productRepository.InsertAsync(iphone15, autoSave: true);
            await _productRepository.InsertAsync(samsungS24, autoSave: true);
        }
    }
}