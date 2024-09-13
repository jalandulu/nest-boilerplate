import { Global, Module } from '@nestjs/common';
import { AuthMapper } from './auth';
import { FileMapper } from './storage';
import { NotificationMapper } from './notification';
import { PermissionMapper, RoleMapper } from './access';
import { ProfileMapper } from './profile';

@Global()
@Module({
  providers: [
    AuthMapper,
    ProfileMapper,
    FileMapper,
    NotificationMapper,
    RoleMapper,
    PermissionMapper,
  ],
  exports: [
    AuthMapper,
    ProfileMapper,
    FileMapper,
    NotificationMapper,
    RoleMapper,
    PermissionMapper,
  ],
})
export class MapperModule {}
