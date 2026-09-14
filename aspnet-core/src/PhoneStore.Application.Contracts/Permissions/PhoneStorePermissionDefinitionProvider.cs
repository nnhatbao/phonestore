using PhoneStore.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace PhoneStore.Permissions;

public class PhoneStorePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(PhoneStorePermissions.GroupName);
        //Define your own permissions here. Example:
        //myGroup.AddPermission(PhoneStorePermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<PhoneStoreResource>(name);
    }
}
