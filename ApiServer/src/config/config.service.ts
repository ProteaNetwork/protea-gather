import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import * as path from 'path';
import * as pkg from '../../package.json';
import { getOsEnv, normalizePort, toBool, toNumber } from './envHelpers';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  [key: string]: any;
}
@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    // const config = dotenv.parse(fs.readFileSync(filePath));

    dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

    this.envConfig = {
      node: process.env.NODE_ENV || 'development',
      isProduction: process.env.NODE_ENV === 'production',
      isTest: process.env.NODE_ENV === 'test',
      isDevelopment: process.env.NODE_ENV === 'development',
      app: {
        name: getOsEnv('APP_NAME'),
        version: (pkg as any).version,
        description: (pkg as any).description,
        host: getOsEnv('APP_HOST'),
        schema: getOsEnv('APP_SCHEMA'),
        routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
        port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
      },
      log: {
        level: getOsEnv('LOG_LEVEL'),
        json: toBool(getOsEnv('LOG_JSON')),
        output: getOsEnv('LOG_OUTPUT'),
      },
      mongodb: {
        username: getOsEnv('MONGO_USERNAME'),
        password: getOsEnv('MONGO_PASSWORD'),
        hosts: [{
          host: getOsEnv('MONGO_HOST'),
          port: toNumber(getOsEnv('MONGO_PORT')),
        }],
        database: getOsEnv('MONGO_DATABASE'),
      },
      bcrypt: {
        saltRounds: toNumber(getOsEnv('BCRYPT_SALT_ROUND')),
      },
      jwt: {
        secret: getOsEnv('JWT_SECRET'),
        expiry: toNumber(getOsEnv('JWT_EXPIRY')),
      },
      // this.validateInput(config);
    };
  }

  get(key?: string): any {
      return this.envConfig[key];
    }

  getAll(): any {
    return this.envConfig;
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      PORT: Joi.number().default(3000),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarSchema,
    );

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    return validatedEnvConfig;
}
}
