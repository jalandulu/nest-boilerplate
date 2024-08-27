import { PutObjectCommandOutput } from '@aws-sdk/client-s3';

export interface IStorageUpload {
  path: string;
  basePath: string;
  fullPath: string;
  stored: PutObjectCommandOutput;
}
