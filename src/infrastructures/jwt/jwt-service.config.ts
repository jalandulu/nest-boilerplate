import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { IJwtServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions | Promise<JwtModuleOptions> {
    const config = this.configService.get<IJwtServiceEnv>('jwt');

    return {
      secret: config.secretKey,
      signOptions: {
        issuer: config.issuer,
        audience: config.audience,
        expiresIn: config.expiresIn,
      },
    } as JwtModuleOptions;
  }
}
