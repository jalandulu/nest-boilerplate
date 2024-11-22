import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<FastifyRequest>();

    const hostname = request.hostname;
    const ip = request.ip || request.connection.remoteAddress;
    this.logger.log(`incoming request from Host: ${hostname}, IP: ${ip}`);

    return next.handle();
  }
}
