import { Global, Module } from '@nestjs/common';
import { IJwtRepository, IStorageRepository } from 'src/cores/interfaces';
import { JwtRepository } from './jwt.repository';
import { StorageRepository } from './storage.repository';

@Global()
@Module({
  providers: [
    { provide: IJwtRepository, useClass: JwtRepository },
    { provide: IStorageRepository, useClass: StorageRepository },
  ],
  exports: [
    { provide: IJwtRepository, useClass: JwtRepository },
    { provide: IStorageRepository, useClass: StorageRepository },
  ],
})
export class RepositoryModule {}
