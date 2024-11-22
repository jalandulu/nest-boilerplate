import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();

    if (request.query) {
      request.query = {
        ...(typeof request.query === 'object' ? request.query : {}),
        _params: request.params,
      };
    }

    if (request.body) {
      request.body = {
        ...(typeof request.body === 'object' ? request.body : {}),
        _params: request.params,
      };
    }

    return next.handle();
  }
}
