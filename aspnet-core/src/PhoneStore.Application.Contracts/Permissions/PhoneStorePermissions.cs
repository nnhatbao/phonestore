namespace PhoneStore.Permissions
{
    public static class PhoneStorePermissions
    {
        public const string GroupName = "PhoneStore";

        public static class Products
        {
            public const string Default = GroupName + ".Products";
            public const string Create = Default + ".Create";
            public const string Edit = Default + ".Edit";
            public const string Delete = Default + ".Delete";
        }
    }
}