import { expect } from "chai";
import { ValidationError } from "joi";

import { Environments } from "@conduit/types";

import { getAppConfigInstance } from "../app/AppConfig";
import { config } from "../app/config";

describe("App Config", () => {
	it("should be able to update the app config using environment variables", () => {
		let appConfig = getAppConfigInstance();
		expect(appConfig.server.appSignature).equals(
			config.testing.server.appSignature
		);
		process.env.SERVER_APP_SIGNATURE = "NEW_SIGNATURE";
		appConfig = getAppConfigInstance();
		expect(appConfig.server.appSignature).equals("NEW_SIGNATURE");
	});

	it("should be able to get the app config in all environments", () => {
		Object.values(Environments).forEach((environment) => {
			process.env.NODE_ENV = environment;
			getAppConfigInstance();
		});
	});

	it("should be able to parse string environment variables in the required format", () => {
		process.env.AUTH_SALT_ROUNDS = "100";
		const appConfig = getAppConfigInstance();
		expect(typeof appConfig.auth.saltRounds === "number").to.be.true;
		expect(appConfig.auth.saltRounds).equals(100);
	});

	it("should throw an error if provided with the wrong type of environment variable", () => {
		process.env.AUTH_SALT_ROUNDS = "HELLO";
		try {
			getAppConfigInstance();
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(ValidationError);
		}
	});
});
