import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtEntity } from 'src/cores/entities';

export const AuthPayload = createParamDecorator(
  (data: keyof JwtEntity | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
