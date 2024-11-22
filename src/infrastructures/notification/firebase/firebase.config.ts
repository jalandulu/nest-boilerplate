import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseModuleOptions, FirebaseModuleOptionsFactory } from 'nestjs-firebase';
import { IFirebaseServiceEnv } from 'src/cores/interfaces';

@Injectable()
export class FirebaseConfigService implements FirebaseModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createFirebaseModuleOptions(): FirebaseModuleOptions | Promise<FirebaseModuleOptions> {
    const config = this.configService.get<IFirebaseServiceEnv>('firebase');

    return {
      googleApplicationCredential: path.join(
        process.env.PWD,
        `dist/src/storages/${config.credentialPath}`,
      ),
    };
  }
}
