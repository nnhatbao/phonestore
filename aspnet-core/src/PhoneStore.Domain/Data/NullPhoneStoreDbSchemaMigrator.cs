using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace PhoneStore.Data;

/* This is used if database provider does't define
 * IPhoneStoreDbSchemaMigrator implementation.
 */
public class NullPhoneStoreDbSchemaMigrator : IPhoneStoreDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
