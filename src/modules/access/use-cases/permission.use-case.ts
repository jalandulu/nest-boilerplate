import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/services';

@Injectable()
export class PermissionUseCase {
  constructor(private readonly permissionService: PermissionService) {}

  async findAll() {
    return await this.permissionService.groupPermissionsByModule();
  }

  async findByRole(roleId: number) {
    return await this.permissionService.groupPermissionsByModule(roleId);
  }
}
