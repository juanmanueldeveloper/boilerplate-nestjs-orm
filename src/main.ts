import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { TrimStringsPipe } from './common/transformer/trim-strings.pipe';
import { AppModule } from './main/app.module';
import { setupSwagger } from './swagger';
import { ConfigService } from './config';
import { NestExpressApplication } from '@nestjs/platform-express';

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
    Logger.log(`👍 server started at http://localhost:${appPort}`, projectName);
    Logger.log(`👍 http://localhost:${appPort}${rootPath}/health`, projectName);
    Logger.log(`👍 http://localhost:${appPort}/healthz`, projectName);
  });
};

/**
 * Run app
 */
void bootstrap();
