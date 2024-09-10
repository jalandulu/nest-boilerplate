import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { ICacheServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class IORedisConfigService {
  constructor(private readonly configService: ConfigService) {}

  async createIORedisClient(): Promise<Redis> {
    const config = await this.configService.get<ICacheServiceEnv>('redis');

    return new Redis({
      host: config.host,
      port: config.port,
      password: config.password,
    });
  }
}
