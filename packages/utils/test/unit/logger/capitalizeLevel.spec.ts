import { faker } from "@faker-js/faker";
import { expect } from "chai";
import winston from "winston";

import { capitalizeLevel } from "../../../logger/formats";
import { DebugTransport } from "./DebugTransport";

describe("CapitalizeLevel", () => {
	it("should capitalize the first letter of the level attribute", () => {
		const { logger, transport, message } = setup();
		logger.info(message);
		const log = transport.getLatestLog();
		expect(log.message).equals(message);
		expect(log.level).equals("Info");
	});
});

const setup = () => {
	const transport = new DebugTransport();
	const logger = winston.createLogger({
		format: capitalizeLevel(),
		transports: [transport]
	});
	const message = faker.lorem.sentence();
	return {
		logger,
		transport,
		message
	};
};
