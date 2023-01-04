import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { TrimStringsPipe } from './common/transformer/trim-strings.pipe';
import { AppModule } from './main/app.module';
import { setupSwagger } from './swagger';
import { ConfigService } from './config';

/**
 * This method initialize configuration setup
 */
const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const { appPort, rootPath } = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
  app.setGlobalPrefix(rootPath);
  setupSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(appPort);
};

/**
 * Run app
 */
void bootstrap();
