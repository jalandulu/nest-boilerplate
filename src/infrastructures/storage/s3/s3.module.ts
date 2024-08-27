import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { IStorageServiceProvider } from 'src/cores/contracts';

@Module({
  providers: [
    {
      provide: IStorageServiceProvider,
      useClass: S3Service,
    },
  ],
  exports: [IStorageServiceProvider],
})
export class S3Module {}
