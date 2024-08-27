import { AuthService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { JwtEntity } from 'src/cores/entities';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authService: AuthService) {}

  @Transactional()
  async logout(payload: JwtEntity) {
    return await this.authService.destroy(payload.sub);
  }
}
