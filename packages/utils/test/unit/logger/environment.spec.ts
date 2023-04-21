import { faker } from "@faker-js/faker";
import { expect } from "chai";
import winston from "winston";

import { environment } from "../../../logger/formats";
import { DebugTransport } from "./DebugTransport";

describe("Environment", () => {
	it("should include the environment variable in the info object of the log", () => {
		const { logger, transport, message } = setup();
		logger.info(message);
		const log = transport.getLatestLog();
		expect(log.environment).equals(process.env.NODE_ENV);
	});
});

const setup = () => {
	const transport = new DebugTransport();
	const logger = winston.createLogger({
		format: environment(),
		transports: [transport]
	});
	const message = faker.lorem.sentence();
	return {
		logger,
		transport,
		message
	};
};
