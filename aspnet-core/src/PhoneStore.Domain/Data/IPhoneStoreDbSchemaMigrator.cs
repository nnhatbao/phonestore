using System.Threading.Tasks;

namespace PhoneStore.Data;

public interface IPhoneStoreDbSchemaMigrator
{
    Task MigrateAsync();
}
