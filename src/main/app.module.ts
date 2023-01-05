import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AuthModule } from '../modules/auth';
import { CommonModule } from '../common';
import { ConfigModule, ConfigService } from '../config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpLoggerMiddleware } from 'src/common/middleware/http-logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ({ config }: ConfigService) => {
        return {
          type: config.database.postgress.type,
          host: config.database.postgress.host,
          port: config.database.postgress.port,
          username: config.database.postgress.username,
          password: config.database.postgress.password,
          database: config.database.postgress.database,
          entities: [__dirname + './../**/**.dto{.ts,.js}'],
          synchronize: config.database.postgress.sync === true,
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    AuthModule,
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HttpLoggerMiddleware)
      .forRoutes('*');
  }
}
