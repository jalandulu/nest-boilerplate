import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as fastify from 'fastify';

export const Files = createParamDecorator(
  async (
    _data: unknown,
    ctx: ExecutionContext,
  ): Promise<null | Record<string, S3.MultipartFile[]>> => {
    const req = ctx.switchToHttp().getRequest() as fastify.FastifyRequest;
    return req.storedFiles;
  },
);
