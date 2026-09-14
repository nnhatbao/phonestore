using System;
using System.Collections.Generic;
using System.Text;
using PhoneStore.Localization;
using Volo.Abp.Application.Services;

namespace PhoneStore;

/* Inherit your application services from this class.
 */
public abstract class PhoneStoreAppService : ApplicationService
{
    protected PhoneStoreAppService()
    {
        LocalizationResource = typeof(PhoneStoreResource);
    }
}
