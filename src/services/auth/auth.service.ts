import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { TransactionHost } from '@nestjs-cls/transactional';
import { ConfigService } from '@nestjs/config';
import { IJwtServiceEnv } from 'src/cores/interfaces';
import { ICacheServiceProvider } from 'src/cores/contracts';
import { Hash } from 'src/common/helpers';
import { LocalAuthEntity } from 'src/cores/entities';
import { AccountStatus } from 'src/cores/enums';
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

  async attempt({ localAuth }: { localAuth: LocalAuthEntity }) {
    const permissions = localAuth.permissions.map((p) => p.slug);

    const accessToken = await this.jwtService.accessToken({
      userId: localAuth.id,
      username: localAuth.username,
    });

    await Promise.all([
      this.destroy(localAuth.id),
      this.setAccessToken(localAuth.id, accessToken),
      this.setPermissions(localAuth.id, permissions),
      this.setUser(localAuth.id, localAuth),
      this.setCacheStrategy(localAuth.id),
    ]);

    return accessToken;
  }

  async destroy(userId: string) {
    await Promise.all([
      this.cacheService.del(`${userId}:accessToken`),
      this.cacheService.del(`${userId}:permissions`),
      this.cacheService.del(`${userId}:user`),
      this.cacheService.del(`${userId}:caching`),
    ]);
  }

  async accessToken(userId: string) {
    return await this.cacheService.get<string>(`${userId}:accessToken`);
  }

  async permissions(userId: string) {
    return await this.cacheService.get<string[]>(`${userId}:permissions`);
  }

  async user(userId: string): Promise<LocalAuthEntity> {
    return await this.cacheService.get<LocalAuthEntity>(`${userId}:user`);
  }

  async cacheStrategy(userId: string) {
    const caching = await this.cacheService.get<number | undefined>(
      `${userId}:caching`,
    );

    if (!caching) {
      const [accessToken, permissions, user] = await Promise.all([
        this.accessToken(userId),
        this.permissions(userId),
        this.user(userId),
      ]);

      if (!accessToken) return false;

      await Promise.all([
        this.setAccessToken(userId, accessToken),
        this.setPermissions(userId, permissions),
        this.setUser(userId, user),
        this.setCacheStrategy(userId),
      ]);

      return true;
    }

    return caching ? true : false;
  }

  async setAccessToken(userId: string, accessToken: string) {
    await this.cacheService.set(
      `${userId}:accessToken`,
      accessToken,
      this.jwtConfig.expiresIn,
    );
  }

  async setPermissions(userId: string, permissions: string[]) {
    await this.cacheService.set(
      `${userId}:permissions`,
      permissions,
      this.jwtConfig.expiresIn,
    );
  }

  async setUser(userId: string, user: LocalAuthEntity) {
    await this.cacheService.set(
      `${userId}:user`,
      user,
      this.jwtConfig.expiresIn,
    );
  }

  async setCacheStrategy(userId: string) {
    await this.cacheService.set(
      `${userId}:caching`,
      1,
      this.jwtConfig.expiresIn,
    );
  }

  async hasPermission(userId: string, reqPermissions: string[]) {
    const permissions = await this.permissions(userId);
    return reqPermissions.some((permission) =>
      permissions.includes(permission),
    );
  }
}
