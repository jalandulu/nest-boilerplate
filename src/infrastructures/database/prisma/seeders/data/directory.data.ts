import { Prisma } from '@prisma/client';

export const directories: Prisma.StgDirectoryUncheckedCreateInput[] = [
  {
    name: 'Home',
    path: '/',
    starred: true,
    removable: false,
    editable: false,
    children: {
      create: [
        {
          name: 'Users',
          path: '/users',
          starred: true,
          removable: false,
          editable: false,
          children: {
            create: [
              {
                name: 'Pictures',
                path: '/users/pictures',
                starred: true,
                removable: false,
                editable: false,
              },
            ],
          },
        },
      ],
    },
  },
];
