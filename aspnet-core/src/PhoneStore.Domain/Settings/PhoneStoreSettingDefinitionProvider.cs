using Volo.Abp.Settings;

namespace PhoneStore.Settings;

public class PhoneStoreSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(PhoneStoreSettings.MySetting1));
    }
}
