import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtEntity } from 'src/cores/entities';
import { AuthService } from 'src/services';
import { AuthStrategy } from 'src/cores/enums';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.Access,
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>('jwt.secretKey'),
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtEntity) {
    const cacheStrategy = await this.authService.cacheStrategy(payload.sub);

    if (!cacheStrategy) {
      return false;
    }

    return payload;
  }
}
