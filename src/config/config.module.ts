import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService('../environments/config.json'),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
