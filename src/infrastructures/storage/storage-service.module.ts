import { Global, Module } from '@nestjs/common';
import { S3Module } from './s3/s3.module';

@Global()
@Module({
  imports: [S3Module],
  exports: [S3Module],
})
export class StorageServiceModule {}
