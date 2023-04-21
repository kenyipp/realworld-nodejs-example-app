import flat, { unflatten } from "flat";
import { defaultsDeep, fromPairs, upperCase } from "lodash";

import { AnyObject } from "@conduit/types";

import { config } from "./config";
import { appConfigSchema } from "./config/schema";

const SESSIONS = ["server", "auth", "database"];

class AppConfig {
	server: {
		port: number;
		appSignature: string;
		tokenExpiresIn?: number;
	};

	auth: {
		saltRounds: number;
	};

	database: {
		host: string;
		user: string;
		password: string;
		port: number;
		database: string;
	};

	constructor() {
		this.updaterAppConfigFromJsonConfig();
		this.updateAppConfigFromEnvs();
	}

	static getInstance() {
		return new AppConfig();
	}

	private updaterAppConfigFromJsonConfig() {
		let baseConfig = config.default;
		if (config[process.env.NODE_ENV]) {
			baseConfig = defaultsDeep(
				{},
				config[process.env.NODE_ENV],
				baseConfig
			);
		}
		defaultsDeep(this, baseConfig);
	}

	private updateAppConfigFromEnvs() {
		const flattedAppConfig: AnyObject = flat(this);
		const flattedKeys = Object.keys(flattedAppConfig);
		const envKeyToFlattedKey = fromPairs(
			flattedKeys.map((key) => [upperCase(key).replace(/ /g, "_"), key])
		);
		let appConfig: AnyObject = unflatten(
			fromPairs(
				Object.keys(envKeyToFlattedKey).map((envKey) => [
					envKeyToFlattedKey[envKey],
					process.env[envKey] ||
						flattedAppConfig[envKeyToFlattedKey[envKey]]
				])
			)
		);
		appConfig = this.validateFormat(appConfig);
		SESSIONS.forEach((session) => {
			this[session] = appConfig[session];
		});
	}

	private validateFormat(input: AnyObject) {
		const { value, error } = appConfigSchema.validate(input);
		if (error) {
			throw error;
		}
		return value;
	}
}

export const appConfig = AppConfig.getInstance();
export const getAppConfigInstance = AppConfig.getInstance;
