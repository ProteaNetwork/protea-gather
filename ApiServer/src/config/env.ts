import * as dotenv from 'dotenv';
import * as path from 'path';
import * as pkg from '../../package.json';
import { getOsEnv, normalizePort, toBool, toNumber } from './envHelpers';

dotenv.config({ path: path.join(process.cwd(), `.env${((process.env.NODE_ENV === 'test') ? '.test' : '')}`) });

export const env = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getOsEnv('APP_NAME'),
    version: (pkg as any).version,
    description: (pkg as any).description,
    host: getOsEnv('APP_HOST'),
    schema: getOsEnv('APP_SCHEMA') || 'http',
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
  },
  log: {
    level: getOsEnv('LOG_LEVEL') || 'info',
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
  jwt: {
    secret: getOsEnv('JWT_SECRET'),
    expiry: toNumber(getOsEnv('JWT_EXPIRY')),
  },
  ethers: {
    provider: getOsEnv('ETHERS_PROVIDER') || 'jsonRpcProvider',
    network: getOsEnv('ETHERS_NETWORK') || 'homestead',
    rpcUrl: getOsEnv('ETHERS_RPC_PROVIDER_URL') || 'http://localhost:8545',
  },
  serverWallet: {
    privateKey: getOsEnv('APPLICATION_WALLET_PRIVATE_KEY'),
    mnemonic: getOsEnv('APPLICATION_WALLET_MNEMONIC'),
  },
  contracts: {

  },
};
