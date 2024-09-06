import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { ConfigService } from '@nestjs/config';
import { IJwtServiceEnv } from 'src/cores/interfaces';
import { ICacheServiceProvider } from 'src/cores/contracts';
import { Hash } from 'src/common/helpers';
import { LocalAuthEntity } from 'src/cores/entities';
import { AccountStatus, TokenScope } from 'src/cores/enums';
import { JwtService } from './jwt.service';
import { ExtendedPrismaClient } from 'src/infrastructures/database/prisma/prisma.extension';

@Injectable()
export class AuthService {
  private jwtConfig: IJwtServiceEnv;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: ICacheServiceProvider,
    private readonly dataService: TransactionHost<
      TransactionalAdapterPrisma<ExtendedPrismaClient>
    >,
  ) {
    this.jwtConfig = this.configService.get<IJwtServiceEnv>('jwt');
  }

  async validate(username: string, password: string) {
    const identity = await this.dataService.tx.identity.findFirst({
      where: {
        username,
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            picture: true,
            notificationTokens: true,
          },
        },
        role: true,
        permissionsOnIdentities: {
          select: {
            permission: {
              select: {
                id: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!identity) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username doesn't registered.`],
        },
      ]);
    }

    if (identity.status === AccountStatus.Inactive) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username is inactive, please contact the administrator.`],
        },
      ]);
    }

    if (!(await Hash.verify(password, identity.password))) {
      throw new BadRequestException([
        {
          field: 'username',
          errors: [`username or password doesn't match.`],
        },
      ]);
    }

    return identity;
  }

  async attempt({
    localAuth,
  }: {
    localAuth: LocalAuthEntity;
  }): Promise<{ accessToken: string; refreshToken?: string }> {
    const permissions = localAuth.permissions.map((p) => p.slug);

    const token: { accessToken: string; refreshToken?: string } = {
      accessToken: '',
      refreshToken: undefined,
    };

    token.accessToken = await this.jwtService.accessToken({
      userId: localAuth.id,
      username: localAuth.username,
    });

    if (this.isRefreshStrategy()) {
      token.refreshToken = await this.jwtService.refreshToken({
        userId: localAuth.id,
        username: localAuth.username,
      });
    }

    await Promise.all([
      this.destroy(localAuth.id),
      this.setAccessToken(localAuth.id, token.accessToken),
      this.setRefreshToken(localAuth.id, token.refreshToken),
      this.setPermissions(localAuth.id, permissions),
      this.setUser(localAuth.id, localAuth),
      this.setCacheStrategy(localAuth.id),
    ]);

    return token;
  }

  async revalidateToken(userId: string) {
    const [user, permissions] = await Promise.all([
      this.user(userId),
      this.permissions(userId),
    ]);

    const token: { accessToken: string; refreshToken: string } = {
      accessToken: '',
      refreshToken: '',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.accessToken({
        userId: user.id,
        username: user.username,
      }),
      this.jwtService.refreshToken({
        userId: user.id,
        username: user.username,
      }),
    ]);

    token.accessToken = accessToken;
    token.refreshToken = refreshToken;

    await Promise.all([
      this.destroy(user.id),
      this.setAccessToken(user.id, token.accessToken),
      this.setRefreshToken(user.id, token.refreshToken),
      this.setPermissions(user.id, permissions),
      this.setUser(user.id, user),
      this.setCacheStrategy(user.id),
    ]);

    return { user, permissions, token };
  }

  async destroy(userId: string) {
    await Promise.all([
      this.cacheService.del(`${userId}:accessToken`),
      this.cacheService.del(`${userId}:refreshToken`),
      this.cacheService.del(`${userId}:permissions`),
      this.cacheService.del(`${userId}:user`),
      this.cacheService.del(`${userId}:caching`),
    ]);
  }

  async cacheStrategy(userId: string, token: string) {
    const caching = await this.cacheService.get<number | undefined>(
      `${userId}:caching`,
    );

    if (!caching) {
      const accessToken = await this.accessToken(userId);
      if (!accessToken) return false;
      if (accessToken !== token) return false;

      const [permissions, user] = await Promise.all([
        this.permissions(userId),
        this.user(userId),
      ]);

      await Promise.all([
        this.setAccessToken(userId, accessToken),
        this.setPermissions(userId, permissions),
        this.setUser(userId, user),
        this.setCacheStrategy(userId),
      ]);

      return true;
    }

    const cachedAccessToken = await this.accessToken(userId);

    return cachedAccessToken === token;
  }

  async refreshStrategy(userId: string, token: string) {
    const cachedRefreshToken = await this.refreshToken(userId);
    if (!cachedRefreshToken) return false;

    return cachedRefreshToken === token;
  }

  async accessToken(userId: string) {
    return await this.cacheService.get<string>(`${userId}:accessToken`);
  }

  async refreshToken(userId: string) {
    return await this.cacheService.get<string>(`${userId}:refreshToken`);
  }

  async permissions(userId: string) {
    return await this.cacheService.get<string[]>(`${userId}:permissions`);
  }

  async user(userId: string): Promise<LocalAuthEntity> {
    return await this.cacheService.get<LocalAuthEntity>(`${userId}:user`);
  }

  async setAccessToken(userId: string, accessToken: string) {
    await this.cacheService.set(
      `${userId}:accessToken`,
      accessToken,
      this.jwtService.expiration({ scope: TokenScope.Access }),
    );
  }

  async setRefreshToken(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.cacheService.set(
        `${userId}:refreshToken`,
        refreshToken,
        this.jwtService.expiration({ scope: TokenScope.Refresh }),
      );
    }
  }

  async setPermissions(userId: string, permissions: string[]) {
    await this.cacheService.set(
      `${userId}:permissions`,
      permissions,
      this.jwtService.expiration({ scope: this.expirationScope() }),
    );
  }

  async setUser(userId: string, user: LocalAuthEntity) {
    await this.cacheService.set(
      `${userId}:user`,
      user,
      this.jwtService.expiration({ scope: this.expirationScope() }),
    );
  }

  async setCacheStrategy(userId: string) {
    await this.cacheService.set(
      `${userId}:caching`,
      1,
      this.jwtService.expiration({ scope: TokenScope.Refresh }),
    );
  }

  async hasPermission(userId: string, reqPermissions: string[]) {
    const permissions = await this.permissions(userId);
    return reqPermissions.some((permission) =>
      permissions.includes(permission),
    );
  }

  isRefreshStrategy() {
    return this.jwtConfig.strategy === 'refresh';
  }

  expirationScope() {
    return this.isRefreshStrategy() ? TokenScope.Refresh : TokenScope.Refresh;
  }
}
