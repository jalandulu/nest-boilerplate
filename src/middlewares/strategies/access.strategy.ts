import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtEntity, ProfileEntity } from 'src/cores/entities';
import { AuthService } from 'src/services';
import { AuthStrategy, TokenScope } from 'src/cores/enums';
import { FastifyRequest } from 'fastify';
import { IJwtServiceEnv } from 'src/cores/interfaces';
import { ICacheServiceProvider } from 'src/cores/contracts';

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

    return await this.cacheServiceProvider.get<ProfileEntity>(
      `${payload.sub}:user`,
    );
  }

  async cacheStrategy(req: FastifyRequest, payload: JwtEntity) {
    const token = req.headers['authorization'].replaceAll('Bearer ', '');
    return await this.authService.cacheStrategy(payload.sub, token);
  }
}
