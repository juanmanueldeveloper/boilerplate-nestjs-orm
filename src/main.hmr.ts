/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './main/app.module';
import { setupSwagger } from './swagger';
import { ConfigService } from './config';
import { TrimStringsPipe } from './common';

declare const module;

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

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};

/**
 * Run app
 */
void bootstrap();
