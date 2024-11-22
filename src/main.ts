import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { ValidationPipe } from './middlewares/pipes';
import {
  LoggingInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from './middlewares/interceptors';
import fastifyMultipart from '@fastify/multipart';
import * as qs from 'qs';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true,
      querystringParser: (str) => qs.parse(str),
    }),
  );

  await app.register(fastifyMultipart);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.enableCors({
    origin: process.env.CLIENT_DOMAIN.trim().split(','),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
      },
      validateCustomDecorators: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new RequestInterceptor(),
    new ResponseInterceptor(),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest Biolerplate API')
    .setDescription('Nest Biolerplate API Project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
