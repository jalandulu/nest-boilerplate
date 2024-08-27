import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/services';
import { AuthStrategy } from 'src/cores/enums';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  AuthStrategy.Local,
) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const identity = await this.authService.validate(username, password);
    if (!identity) {
      throw new UnauthorizedException();
    }

    const permissions = identity.permissionsOnIdentities.map((p) => {
      return { id: p.permission.id, slug: p.permission.slug };
    });

    return {
      ...identity,
      permissions,
    };
  }
}
