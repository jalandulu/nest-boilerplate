import { Global, Module } from '@nestjs/common';
import { AuthMapper } from './auth';
import { FileMapper } from './storage';
import { NotificationMapper, NotificationTokenMapper } from './notification';
import { PermissionMapper, RoleMapper } from './access';
import { ProfileMapper } from './profile';
import { AccountMapper, UserMapper } from './user';

@Global()
@Module({
  providers: [
    AuthMapper,
    ProfileMapper,
    UserMapper,
    AccountMapper,
    FileMapper,
    NotificationMapper,
    NotificationTokenMapper,
    RoleMapper,
    PermissionMapper,
  ],
  exports: [
    AuthMapper,
    ProfileMapper,
    UserMapper,
    AccountMapper,
    FileMapper,
    NotificationMapper,
    NotificationTokenMapper,
    RoleMapper,
    PermissionMapper,
  ],
})
export class MapperModule {}
