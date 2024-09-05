import { Injectable } from '@nestjs/common';
import { IJwtSignDto } from 'src/cores/dtos';
import { JwtEntity } from 'src/cores/entities';
import { TokenScope } from 'src/cores/enums';
import { IJwtRepository } from 'src/cores/interfaces';

@Injectable()
export class JwtService {
  constructor(private readonly jwtRepository: IJwtRepository) {}

  async verify(token: string): Promise<JwtEntity> {
    try {
      return await this.jwtRepository.verify({ token });
    } catch (error) {
      return null;
    }
  }

  async generate(data: IJwtSignDto) {
    return await this.jwtRepository.generate({ data });
  }

  async accessToken({
    userId,
    username,
    permissions,
  }: {
    userId: string;
    username: string;
    permissions?: string[];
  }) {
    return await this.jwtRepository.generate({
      data: {
        userId,
        username,
        scope: TokenScope.Access,
        permissions,
      },
    });
  }

  async refreshToken({
    userId,
    username,
    permissions,
  }: {
    userId: string;
    username: string;
    permissions?: string[];
  }) {
    return await this.jwtRepository.generate({
      data: {
        userId,
        username,
        scope: TokenScope.Refresh,
        permissions,
      },
    });
  }

  async rememberMeToken({
    userId,
    username,
    permissions,
  }: {
    userId: string;
    username: string;
    permissions: string[];
  }) {
    return await this.jwtRepository.generate({
      data: {
        userId,
        username,
        scope: TokenScope.RememberMe,
        permissions,
      },
    });
  }

  async generateTokens(
    payload: {
      sub: string;
      username: string;
      permissions: string[];
    },
    rememberMe?: boolean,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    rememberMeToken?: string;
  }> {
    const accessToken = await this.accessToken({
      userId: payload.sub,
      username: payload.username,
      permissions: payload.permissions,
    });

    const refreshToken = await this.refreshToken({
      userId: payload.sub,
      username: payload.username,
      permissions: payload.permissions,
    });

    if (rememberMe) {
      const rememberMeToken = await this.rememberMeToken({
        userId: payload.sub,
        username: payload.username,
        permissions: payload.permissions,
      });

      return { accessToken, refreshToken, rememberMeToken };
    }

    return { accessToken, refreshToken };
  }

  expiration(params: { scope: TokenScope }) {
    return this.jwtRepository.getExpiration(params);
  }
}
