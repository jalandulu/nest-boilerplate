import { Prisma } from '@prisma/client';

const type = {
  accountStatus: 'account-status',
  tokenType: 'token-type',
  userType: 'user-type',
  storage: 'storage',
};

export const codes: Prisma.CodeUncheckedCreateInput[] = [
  {
    type: type.tokenType,
    code: 'OAT001',
    name: 'Access Token',
  },
  {
    type: type.accountStatus,
    code: 'AST001',
    name: 'Active',
  },
  {
    type: type.accountStatus,
    code: 'AST002',
    name: 'Inactive',
  },
  {
    type: type.userType,
    name: 'Operator',
    code: 'UTP001',
  },
  {
    type: type.userType,
    name: 'Customer',
    code: 'UTP002',
  },
  {
    type: type.storage,
    name: 'File Manager',
    code: 'FIL000',
  },
  {
    type: type.storage,
    name: 'Profile Picture',
    code: 'FIL001',
  },
];
