import Knex from "knex";

import { Environments } from "@conduit/types";

import { config } from "../knexfile";

export const knex = Knex(
	config[process.env.NODE_ENV ?? Environments.Development]!
);

/**
 *
 * Resets the database by rolling back all migrations and running all seed files.
 * This function should only be run in a testing environment.
 *
 * @throws {Error} If the function is run in a non-testing environment.
 *
 */
export const dangerouslyResetDb = async () => {
	if (
		process.env.NODE_ENV !== Environments.CI &&
		process.env.NODE_ENV !== Environments.Development &&
		process.env.NODE_ENV !== Environments.Testing
	) {
		throw new Error(
			"You cannot reset the database using this function in a non-testing environment"
		);
	}
	await knex.migrate.rollback(undefined, true);
	await knex.migrate.latest();
	await knex.seed.run();
};
