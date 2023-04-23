import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import rawBodyMiddleware from './utils/rawBody.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      always: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(rawBodyMiddleware());

  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
