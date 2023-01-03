import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { IAppConfig } from './interfaces/app-config.interface';
import { Environment } from './enums/environment.enum';
import { resolve } from 'path';
export class ConfigService {
  private readonly configuration: IAppConfig;

  constructor(filePath: string) {
    /**
     * Configure local environment
     */
    dotenv.config();

    // Validate .env file or config.json file
    if (process.env.CONFIG) {
      this.configuration = JSON.parse(process.env.CONFIG) as IAppConfig;
    } else {
      this.configuration = JSON.parse(
        fs.readFileSync(resolve(__dirname, filePath), 'utf8'),
      ) as IAppConfig;
    }
    // console.log(this.config);
  }

  get config(): IAppConfig {
    return this.configuration;
  }

  get environment(): string {
    return this.configuration.environment;
  }

  get projectName(): string {
    return this.configuration.projectName;
  }

  get rootPath(): string {
    return this.configuration.rootPath;
  }

  get appPort(): number {
    return this.configuration.appPort;
  }

  get isDevelopment(): boolean {
    return (
      this.configuration.environment === Environment.local ||
      this.configuration.environment === Environment.development ||
      this.configuration.environment === Environment.staging
    );
  }

  get isProduction(): boolean {
    return this.configuration.environment === Environment.production;
  }
}
