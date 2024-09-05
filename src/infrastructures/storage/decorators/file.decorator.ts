import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as fastify from 'fastify';
import { S3 } from '../globals';

export const Files = createParamDecorator(
  async (
    _data: unknown,
    ctx: ExecutionContext,
  ): Promise<null | Record<string, S3.MultipartFile[]>> => {
    const req = ctx.switchToHttp().getRequest() as fastify.FastifyRequest;
    return req.storedFiles;
  },
);
