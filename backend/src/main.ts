import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',')
    : ['http://localhost:3000'];
  app.enableCors({ origin: corsOrigin, credentials: true });

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
