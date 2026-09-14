using Microsoft.EntityFrameworkCore;
using Volo.Abp.AuditLogging.EntityFrameworkCore;
using Volo.Abp.BackgroundJobs.EntityFrameworkCore;
using Volo.Abp.Data;
using Volo.Abp.DependencyInjection;
using Volo.Abp.EntityFrameworkCore;
using Volo.Abp.EntityFrameworkCore.Modeling;
using Volo.Abp.FeatureManagement.EntityFrameworkCore;
using Volo.Abp.Identity;
using Volo.Abp.Identity.EntityFrameworkCore;
using Volo.Abp.IdentityServer.EntityFrameworkCore;
using Volo.Abp.PermissionManagement.EntityFrameworkCore;
using Volo.Abp.SettingManagement.EntityFrameworkCore;
using Volo.Abp.TenantManagement;
using Volo.Abp.TenantManagement.EntityFrameworkCore;
using PhoneStore.Products;
using PhoneStore.Orders;

namespace PhoneStore.EntityFrameworkCore;

[ReplaceDbContext(typeof(IIdentityDbContext))]
[ReplaceDbContext(typeof(ITenantManagementDbContext))]
[ConnectionStringName("Default")]
public class PhoneStoreDbContext :
    AbpDbContext<PhoneStoreDbContext>,
    IIdentityDbContext,
    ITenantManagementDbContext
{
    /* Add DbSet properties for your Aggregate Roots / Entities here. */

    #region Entities from the modules

    /* Notice: We only implemented IIdentityDbContext and ITenantManagementDbContext
     * and replaced them for this DbContext. This allows you to perform JOIN
     * queries for the entities of these modules over the repositories easily. You
     * typically don't need that for other modules. But, if you need, you can
     * implement the DbContext interface of the needed module and use ReplaceDbContext
     * attribute just like IIdentityDbContext and ITenantManagementDbContext.
     *
     * More info: Replacing a DbContext of a module ensures that the related module
     * uses this DbContext on runtime. Otherwise, it will use its own DbContext class.
     */

    //Identity
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }
    public DbSet<IdentityUser> Users { get; set; }
    public DbSet<IdentityRole> Roles { get; set; }
    public DbSet<IdentityClaimType> ClaimTypes { get; set; }
    public DbSet<OrganizationUnit> OrganizationUnits { get; set; }
    public DbSet<IdentitySecurityLog> SecurityLogs { get; set; }
    public DbSet<IdentityLinkUser> LinkUsers { get; set; }

    // Tenant Management
    public DbSet<Tenant> Tenants { get; set; }
    public DbSet<TenantConnectionString> TenantConnectionStrings { get; set; }

    #endregion

    public PhoneStoreDbContext(DbContextOptions<PhoneStoreDbContext> options)
        : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        /* Include modules to your migration db context */
        builder.Entity<Order>(b =>
{
    b.ToTable(PhoneStoreConsts.DbTablePrefix + "Orders", PhoneStoreConsts.DbSchema);
    b.ConfigureByConvention();
    b.Property(x => x.CustomerName).IsRequired().HasMaxLength(128);
    b.Property(x => x.PhoneNumber).IsRequired().HasMaxLength(20);
    b.Property(x => x.TotalPrice).HasPrecision(18, 2);
    b.HasMany(x => x.Items).WithOne().HasForeignKey(x => x.OrderId).IsRequired();
});

builder.Entity<OrderItem>(b =>
{
    b.ToTable(PhoneStoreConsts.DbTablePrefix + "OrderItems", PhoneStoreConsts.DbSchema);
    b.ConfigureByConvention();
    b.Property(x => x.UnitPrice).HasPrecision(18, 2);
});
        builder.ConfigurePermissionManagement();
        builder.ConfigureSettingManagement();
        builder.ConfigureBackgroundJobs();
        builder.ConfigureAuditLogging();
        builder.ConfigureIdentity();
        builder.ConfigureIdentityServer();
        builder.ConfigureFeatureManagement();
        builder.ConfigureTenantManagement();
        builder.Entity<Category>(b =>
    {
        b.ToTable(PhoneStoreConsts.DbTablePrefix + "Categories", PhoneStoreConsts.DbSchema);
        b.ConfigureByConvention(); // Cấu hình tự động Audit logs của ABP
        b.Property(x => x.Name).IsRequired().HasMaxLength(128);
    });

        builder.Entity<Product>(b =>
    {
        b.ToTable(PhoneStoreConsts.DbTablePrefix + "Products", PhoneStoreConsts.DbSchema);
        b.ConfigureByConvention();
        b.Property(x => x.Name).IsRequired().HasMaxLength(256);

        // Khóa ngoại Category -> Product
        b.HasOne<Category>().WithMany().HasForeignKey(x => x.CategoryId).IsRequired();
        
        // Mối quan hệ 1 - N: Product -> Variants
        b.HasMany(x => x.Variants).WithOne().HasForeignKey(x => x.ProductId).IsRequired();
    });

        builder.Entity<ProductVariant>(b =>
        {
            b.ToTable(PhoneStoreConsts.DbTablePrefix + "ProductVariants", PhoneStoreConsts.DbSchema);
            b.ConfigureByConvention();
            b.Property(x => x.Sku).IsRequired().HasMaxLength(64);
            b.Property(x => x.Price).HasPrecision(18, 2);
            b.Property(x => x.SalePrice).HasPrecision(18, 2);
        });

        /* Configure your own tables/entities inside here */

        //builder.Entity<YourEntity>(b =>
        //{
        //    b.ToTable(PhoneStoreConsts.DbTablePrefix + "YourEntities", PhoneStoreConsts.DbSchema);
        //    b.ConfigureByConvention(); //auto configure for the base class props
        //    //...
        //});
    }
}
