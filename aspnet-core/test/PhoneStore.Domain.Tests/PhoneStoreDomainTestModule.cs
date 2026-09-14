using PhoneStore.EntityFrameworkCore;
using Volo.Abp.Modularity;

namespace PhoneStore;

[DependsOn(
    typeof(PhoneStoreEntityFrameworkCoreTestModule)
    )]
public class PhoneStoreDomainTestModule : AbpModule
{

}
