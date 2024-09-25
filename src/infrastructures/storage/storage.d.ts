/// <reference path="./src/infrastructures/storage/storage.d.ts" />

declare global {
  namespace S3 {
    interface MultipartFile {
      buffer: Buffer;
      filename: string;
      size: number;
      mimetype: string;
      fieldname: string;
    }
  }
}

export {};
