import { Prisma } from '@prisma/client';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';

export type FileMap =
  Prisma.StgFileDirectoryGetPayload<Prisma.StgFileDirectoryDefaultArgs>;

export type FilesMap = FileMap[];

export type IStorageUploadEntity = {
  name: string;
  originalName: string;
  ext: string;
  size: number;
  basePath: string;
  path: string;
  fullPath: string;
  stored: PutObjectCommandOutput;
};

export type FileEntity = {
  id: number;
  fileDirectoryId: number;
  name: string;
  extension: string;
  size: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
};
