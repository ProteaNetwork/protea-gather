import { env } from './env';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  node: string;
  isProduction: boolean;
  isTest: boolean;
  isDevelopment: boolean;
  app: {
    [key: string]: any;
  };
  log: {
    [key: string]: any;
  };
  mongodb: {
    [key: string]: any;
  };
  jwt: {
    [key: string]: any;
  };
  ethers: {
    [key: string]: any;
  };
  contracts: {
    [key: string]: any;
  };
  serverWallet: {
    [key: string]: any;
  };
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    this.envConfig = env;
  }

  get(key?: keyof EnvConfig): any {
    return this.envConfig[key];
  }
}
