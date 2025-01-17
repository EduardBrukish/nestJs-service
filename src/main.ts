import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getLogLevel } from './helpers/getLogLevel';

const PORT = process.env.PORT || 4000;
const LOG_LEVEL = getLogLevel(process.env.LOG_LEVEL);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [LOG_LEVEL],
  });

  const config = new DocumentBuilder()
    .setTitle('Home Library')
    .setDescription('Home music library service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(PORT);
}
bootstrap();
