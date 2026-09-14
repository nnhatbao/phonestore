using PhoneStore.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace PhoneStore.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class PhoneStoreController : AbpControllerBase
{
    protected PhoneStoreController()
    {
        LocalizationResource = typeof(PhoneStoreResource);
    }
}
