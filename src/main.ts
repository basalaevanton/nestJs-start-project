import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { config } from './swaggerBuilder';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  });
  app.use(cookieParser());
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));

  console.log(`Application is running on: ${await app.getUrl()}`);
}
start();
