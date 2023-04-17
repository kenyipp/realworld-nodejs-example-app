import {
	each,
	defaultsDeep
} from "lodash";
import path from "path";
import dotenv from "dotenv";
import type { Knex } from "knex";
import { Environments } from "@conduit/types";
import { appConfig } from "@conduit/config";

dotenv.config();

export const config: { [key: string]: Knex.Config } = {

	[Environments.Testing]: {
		client: "better-sqlite3",
		pool: {
			min: 1,
			max: 5,
			/*
			 *
			 * 'npm test' doesn't exit until these timeout. You can also call
			 * knex.destroy() but there isn't a well defined time to do that.
			 *
			 */
			idleTimeoutMillis: 2000,
			destroyTimeoutMillis: 2000
		},
		connection: {
			filename: ":memory:"
		}
	},

	[Environments.Development]: {
		client: "better-sqlite3",
		connection: {
			filename: ":memory:"
		}
	},

	[Environments.CI]: {
		client: "mysql2",
		connection: {
			host: "localhost",
			user: "mysql",
			password: "mysql",
			port: 3306,
			database: "conduit"
		}
	},

	[Environments.Production]: {
		client: "mysql2",
		connection: appConfig.database
	}

};

const defaultConfig: Partial<Knex.Config> = {
	migrations: {
		directory: path.join(__dirname, "./knex/migrations")
	},
	seeds: {
		directory: path.join(__dirname, "./knex/seeds")
	},
	useNullAsDefault: true
};

each(
	config,
	(knexConfig) => {
		defaultsDeep(knexConfig, defaultConfig);
	}
);

export default config;
