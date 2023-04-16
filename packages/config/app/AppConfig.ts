import path from "path";
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

	constructor() {
		SESSIONS.forEach(session => this[session] = config.get(session));
	}
}

export const appConfig = new AppConfig();
