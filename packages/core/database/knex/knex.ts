import Knex from 'knex';

import { NodeEnv } from '@conduit/types';
import { config } from '@conduit/utils';

import { knexConfig as KnexConfig } from './knexfile';

const knexConfig = KnexConfig[config.nodeEnv ?? NodeEnv.Test];

if (!knexConfig) {
  throw new Error(`Invalid node environment - ${config.nodeEnv}`);
}

export const knex = Knex(knexConfig);

export const dangerouslyResetDb = async () => {
  if (config.nodeEnv !== NodeEnv.Test && config.nodeEnv !== NodeEnv.CI) {
    throw new Error(
      `This function should only be called in the test or CI environment (current: ${config.nodeEnv})`
    );
  }
  await knex.migrate.rollback(undefined, true);
  await knex.migrate.latest();
  await knex.seed.run();
};
