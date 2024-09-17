import { S3 } from 'src/infrastructures/storage/globals';
import { ProfileEntity } from '../entities';

declare module 'fastify' {
  interface FastifyRequest {
    storedFiles: Record<string, S3.MultipartFile[]>;
    body: unknown;
    user?: ProfileEntity;
  }
}
