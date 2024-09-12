import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtEntity, LocalAuthEntity } from 'src/cores/entities';
import { AuthService } from 'src/services';
import { AuthStrategy, TokenScope } from 'src/cores/enums';
import { FastifyRequest } from 'fastify';
import { IJwtServiceEnv } from 'src/cores/interfaces';
import { ICacheServiceProvider } from 'src/cores/contracts';
import { AuthMapper } from 'src/modules/auth/mappers/auth.mapper';

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.Access,
) {
  private jwtConfig: IJwtServiceEnv;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheServiceProvider: ICacheServiceProvider,
    private readonly authMapper: AuthMapper,
  ) {
    const jwtConfig = configService.get<IJwtServiceEnv>('jwt');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: jwtConfig.strategy === 'cache',
      secretOrKey: jwtConfig.secretKey,
      passReqToCallback: true,
    });

    this.jwtConfig = jwtConfig;
  }

  async validate(req: FastifyRequest, payload: JwtEntity) {
    if (payload.scope !== TokenScope.Access) return false;

    if (this.jwtConfig.strategy === 'cache') {
      const isValidAccess = await this.cacheStrategy(req, payload);
      if (!isValidAccess) return false;
    }

    const rawUser = await this.cacheServiceProvider.get<LocalAuthEntity>(
      `${payload.sub}:user`,
    );
    const user = rawUser.user;

    return await this.authMapper.profileMap(
      {
        profile: user,
        abilities: rawUser.permissions.map((p) => p.slug),
      },
      rawUser.role,
    );
  }

  async cacheStrategy(req: FastifyRequest, payload: JwtEntity) {
    const token = req.headers['authorization'].replaceAll('Bearer ', '');
    return await this.authService.cacheStrategy(payload.sub, token);
  }
}
