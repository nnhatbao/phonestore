using PhoneStore.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;

namespace PhoneStore.Permissions
{
    public class PhoneStorePermissionDefinitionProvider : PermissionDefinitionProvider
    {
        public override void Define(IPermissionDefinitionContext context)
        {
            var phoneStoreGroup = context.AddGroup(PhoneStorePermissions.GroupName, L("Permission:PhoneStore"));

            var productsPermission = phoneStoreGroup.AddPermission(PhoneStorePermissions.Products.Default, L("Permission:Products"));
            productsPermission.AddChild(PhoneStorePermissions.Products.Create, L("Permission:Products.Create"));
            productsPermission.AddChild(PhoneStorePermissions.Products.Edit, L("Permission:Products.Edit"));
            productsPermission.AddChild(PhoneStorePermissions.Products.Delete, L("Permission:Products.Delete"));
        }

        private static LocalizableString L(string name)
        {
            return LocalizableString.Create<PhoneStoreResource>(name);
        }
    }
}