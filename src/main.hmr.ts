/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './main/app.module';
import { setupSwagger } from './swagger';
import { ConfigService } from './config';
import { TrimStringsPipe } from './common';
import { NestExpressApplication } from '@nestjs/platform-express';

declare const module;

/**
 * This method initialize configuration setup
 */
const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { appPort, rootPath, projectName } = app.get(ConfigService);

  app.enableCors();
  app.useGlobalPipes(new TrimStringsPipe(), new ValidationPipe());
  app.setGlobalPrefix(rootPath);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  setupSwagger(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(appPort, () => {
    Logger.log(`server started at http://localhost:${appPort}`, projectName);
    Logger.log(`http://localhost:${appPort}${rootPath}/health`, projectName);
    Logger.log(`http://localhost:${appPort}/healthz`, projectName);
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
};

/**
 * Run app
 */
void bootstrap();
