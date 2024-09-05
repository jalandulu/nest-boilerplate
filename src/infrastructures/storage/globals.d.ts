// import { FastifyRequest as OriginalFastifyRequest } from 'fastify';

export declare namespace S3 {
  interface MultipartFile {
    buffer: Buffer;
    filename: string;
    size: number;
    mimetype: string;
    fieldname: string;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    storedFiles: Record<string, S3.MultipartFile[]>;
    body: unknown;
  }
}
