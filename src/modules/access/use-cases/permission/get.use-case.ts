import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/services';

@Injectable()
export class GetPermissionUseCase {
  constructor(private readonly permissionService: PermissionService) {}

  async findAll() {
    return await this.permissionService.groupPermissionsByModule();
  }
}
