using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace PhoneStore;

[Dependency(ReplaceServices = true)]
public class PhoneStoreBrandingProvider : DefaultBrandingProvider
{
    public override string AppName => "PhoneStore";
}
