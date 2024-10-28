import 'dotenv/config';

import path from 'path';

import { config } from '@conduit/utils';

import { KnexConfig } from './types';

export const knexConfig: KnexConfig = {
  test: {
    client: 'better-sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, './migrations')
    },
    seeds: {
      directory: path.join(__dirname, './seeds')
    }
  },
  ci: {
    client: 'mysql2',
    connection: config.database.conduit
  },
  develop: {
    client: 'mysql2',
    connection: config.database.conduit
  },
  prod: {
    client: 'mysql2',
    connection: config.database.conduit
  }
};

export default knexConfig;
