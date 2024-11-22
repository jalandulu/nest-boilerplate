export const profile = [
  {
    module: 'Profile',
    action: 'View',
    slug: 'profile:view',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'Profile',
    action: 'Update',
    slug: 'profile:update',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'Profile',
    action: 'Update Username',
    slug: 'profile:update-username',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'Profile',
    action: 'Update Password',
    slug: 'profile:update-password',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'Profile',
    action: 'Delete',
    slug: 'profile:delete',
    use: ['superadmin', 'admin', 'staff'],
  },
];

export const user = [
  {
    module: 'User',
    action: 'View',
    slug: 'user:view',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'User',
    action: 'Create',
    slug: 'user:create',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'User',
    action: 'Update',
    slug: 'user:update',
    use: ['superadmin', 'admin', 'staff'],
  },
  {
    module: 'User',
    action: 'Delete',
    slug: 'user:delete',
    use: ['superadmin', 'admin', 'staff'],
  },
];

export const access = [
  {
    module: 'Access',
    action: 'View',
    slug: 'access:view',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Access',
    action: 'Create',
    slug: 'access:create',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Access',
    action: 'Update',
    slug: 'access:update',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Access',
    action: 'Delete',
    slug: 'access:delete',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Access',
    action: 'Assignment',
    slug: 'access:assignment',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Access',
    action: 'Permission',
    slug: 'access:permission',
    use: ['superadmin', 'admin'],
  },
];

export const account = [
  {
    module: 'Account',
    action: 'View',
    slug: 'account:view',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Create',
    slug: 'account:create',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Update',
    slug: 'account:update',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Access Control',
    slug: 'account:access-control',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Update Username',
    slug: 'account:update-username',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Update Status',
    slug: 'account:update-status',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Update Password',
    slug: 'account:update-password',
    use: ['superadmin', 'admin'],
  },
  {
    module: 'Account',
    action: 'Delete',
    slug: 'account:delete',
    use: ['superadmin', 'admin'],
  },
] as const;

export const permissions = [...profile, ...access, ...user, ...account] as const;

export const permissionSlugs = permissions.map((permission) => permission.slug);

export type PermissionSlug = (typeof permissionSlugs)[number];
