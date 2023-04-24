import { faker } from "@faker-js/faker";
import winston from "winston";

import { customPrintf } from "../../../logger/formats";
import { DebugTransport } from "./DebugTransport";

describe("CustomPrintf", () => {
	it("should able to log the message using the customPrintf function", () => {
		const { logger, message } = setup();
		["info", "debug", "silly", "warn"].forEach((method) => {
			logger[method](message);
		});
	});

	it("should able to log the error using the customPrintf function", () => {
		const { logger, message } = setup();
		logger.error(new Error(message));
	});
});

const setup = () => {
	const transport = new DebugTransport();
	const logger = winston.createLogger({
		format: customPrintf(),
		transports: [transport]
	});
	const message = faker.lorem.sentence();
	return {
		logger,
		transport,
		message
	};
};
