import { Global, Module } from '@nestjs/common';
import { AuthMapper } from './auth';
import { FileMapper } from './storage';
import { NotificationMapper } from './notification';
import { PermissionMapper, RoleMapper } from './access';
import { ProfileMapper } from './profile';
import { UserMapper } from './user';

@Global()
@Module({
  providers: [
    AuthMapper,
    ProfileMapper,
    UserMapper,
    FileMapper,
    NotificationMapper,
    RoleMapper,
    PermissionMapper,
  ],
  exports: [
    AuthMapper,
    ProfileMapper,
    UserMapper,
    FileMapper,
    NotificationMapper,
    RoleMapper,
    PermissionMapper,
  ],
})
export class MapperModule {}
