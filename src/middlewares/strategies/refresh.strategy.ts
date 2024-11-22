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
export class RefreshStrategy extends PassportStrategy(Strategy, AuthStrategy.Refresh) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly cacheServiceProvider: ICacheServiceProvider,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<IJwtServiceEnv>('jwt.secretKey'),
      passReqToCallback: true,
    });
  }

  async validate(req: FastifyRequest, payload: JwtEntity) {
    if (payload.scope !== TokenScope.Refresh) return false;

    const isValidRefresh = await this.refreshStrategy(req, payload);
    if (!isValidRefresh) return false;

    return await this.cacheServiceProvider.get<ProfileEntity>(`${payload.sub}:user`);
  }

  async refreshStrategy(req: FastifyRequest, payload: JwtEntity) {
    const token = req.headers['authorization'].replaceAll('Bearer ', '');
    return await this.authService.refreshStrategy(payload.sub, token);
  }
}
