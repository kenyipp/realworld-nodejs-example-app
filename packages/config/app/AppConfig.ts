import path from "path";
import flat, { unflatten } from "flat";
import type { AnyObject } from "@conduit/types";
import {
	fromPairs,
	upperCase
} from "lodash";

process.env.NODE_CONFIG_DIR = path.join(__dirname, "./config");

import config from "config";

const SESSIONS = ["server", "auth"];

export class AppConfig {

	server: {
		port: number;
		appSignature: string;
		tokenExpiresIn?: string | number;
	}

	auth: {
		saltRounds: number;
	}

	database: {
		host: string;
		user: string;
		password: string;
		port: number;
		database: string;
	}

	constructor() {
		SESSIONS.forEach(session => this[session] = config.get(session));
		this.updateAppConfigFromEnvs();
	}

	private updateAppConfigFromEnvs() {
		const flattedAppConfig: AnyObject = flat(this);
		const flattedKeys = Object.keys(flattedAppConfig);
		const envKeyToFlattedKey = fromPairs(flattedKeys.map(key => [upperCase(key).replace(/ /g, "_"), key]));
		const appConfig: AnyObject = unflatten(
			fromPairs(
				Object
					.keys(envKeyToFlattedKey)
					.map(envKey => [
						envKeyToFlattedKey[envKey],
						process.env[envKey] || flattedAppConfig[envKeyToFlattedKey[envKey]]
					])
			)
		);
		SESSIONS.forEach(session => this[session] = appConfig[session]);
	}

}

export const appConfig = new AppConfig();
