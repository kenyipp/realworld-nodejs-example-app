import flat, { unflatten } from "flat";
import { defaultsDeep, fromPairs, upperCase } from "lodash";

import { AnyObject } from "@conduit/types";

import { config } from "./config";

const SESSIONS = ["server", "auth"];

export class AppConfig {
	server: {
		port: number;
		appSignature: string;
		tokenExpiresIn?: string | number;
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
		const appConfig: AnyObject = unflatten(
			fromPairs(
				Object.keys(envKeyToFlattedKey).map((envKey) => [
					envKeyToFlattedKey[envKey],
					process.env[envKey] ||
						flattedAppConfig[envKeyToFlattedKey[envKey]]
				])
			)
		);
		SESSIONS.forEach((session) => {
			this[session] = appConfig[session];
		});
	}
}

export const appConfig = new AppConfig();
