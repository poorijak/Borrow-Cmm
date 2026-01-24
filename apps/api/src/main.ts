import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // <--- ตัวนี้สำคัญที่สุด ต้องเป็น true
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
