import { Global, Module } from '@nestjs/common';
import { PermissionService, RoleService } from './access';
import { AuthService, IdentityService, JwtService } from './auth';
import { NotificationService, NotificationTokenService } from './notification';
import { DirectoryService, FileDirectoryService, FileService, StorageService } from './storage';
import { UserService } from './user';

@Global()
@Module({
  providers: [
    RoleService,
    PermissionService,
    AuthService,
    IdentityService,
    JwtService,
    NotificationService,
    NotificationTokenService,
    DirectoryService,
    FileDirectoryService,
    FileService,
    StorageService,
    UserService,
  ],
  exports: [
    RoleService,
    PermissionService,
    AuthService,
    IdentityService,
    JwtService,
    NotificationService,
    NotificationTokenService,
    DirectoryService,
    FileDirectoryService,
    FileService,
    StorageService,
    UserService,
  ],
})
export class ServiceModule {}
