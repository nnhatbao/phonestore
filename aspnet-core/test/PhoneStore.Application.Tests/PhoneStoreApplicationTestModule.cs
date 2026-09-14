using Volo.Abp.Modularity;

namespace PhoneStore;

[DependsOn(
    typeof(PhoneStoreApplicationModule),
    typeof(PhoneStoreDomainTestModule)
    )]
public class PhoneStoreApplicationTestModule : AbpModule
{

}
