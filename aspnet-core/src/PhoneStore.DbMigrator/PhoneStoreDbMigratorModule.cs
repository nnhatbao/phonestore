using PhoneStore.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.BackgroundJobs;
using Volo.Abp.Modularity;

namespace PhoneStore.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(PhoneStoreEntityFrameworkCoreModule),
    typeof(PhoneStoreApplicationContractsModule)
    )]
public class PhoneStoreDbMigratorModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        Configure<AbpBackgroundJobOptions>(options => options.IsJobExecutionEnabled = false);
    }
}
