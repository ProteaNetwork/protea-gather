import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  app.use(helmet());
  app.enableCors();
  app.use(compression());
  app.setGlobalPrefix('/api');
  // TODO Get this from config
  await app.listen(3001);
}

bootstrap();
