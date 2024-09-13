import { Injectable } from '@nestjs/common';
import { ProfileEntity } from 'src/cores/entities';
import { UpdatePasswordRequest } from '../requests';
import { IdentityService } from 'src/services';

@Injectable()
export class ProfilePasswordUseCase {
  constructor(private readonly identityService: IdentityService) {}

  async updatePassword(
    profile: ProfileEntity,
    { currentPassword, password }: UpdatePasswordRequest,
  ) {
    return await this.identityService.changePassword(profile.id, {
      currentPassword,
      password,
    });
  }
}
