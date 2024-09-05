import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/services';
import { Transactional } from '@nestjs-cls/transactional';
import { JwtEntity } from 'src/cores/entities';

@Injectable()
export class RefreshUseCase {
  constructor(private readonly authService: AuthService) {}

  @Transactional()
  async refresh(payload: JwtEntity) {
    const { user, permissions, token } = await this.authService.revalidateToken(
      payload.sub,
    );

    return {
      user: user.user,
      abilities: permissions,
      authenticated: token,
    };
  }
}
