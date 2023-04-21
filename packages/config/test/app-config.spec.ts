import { expect } from "chai";

import { AppConfig } from "../app/AppConfig";
import { config } from "../app/config";

describe("App Config", () => {
	it("should able to update the app config by environment variable", () => {
		let appConfig = new AppConfig();
		expect(appConfig.server.appSignature).equals(
			config.testing.server.appSignature
		);
		process.env.SERVER_APP_SIGNATURE = "NEW_SIGNATURE";
		appConfig = new AppConfig();
		expect(appConfig.server.appSignature).equals("NEW_SIGNATURE");
	});
});
