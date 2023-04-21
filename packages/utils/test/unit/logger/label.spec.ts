import { faker } from "@faker-js/faker";
import { expect } from "chai";
import winston from "winston";

import { label as labelFormat } from "../../../logger/formats";
import { DebugTransport } from "./DebugTransport";

describe("Label", () => {
	it("should include a label property in the info object and prepend the label to the beginning of the message", () => {
		const { logger, transport, message } = setup();
		const label = "HELLO";
		logger.info(message, { label });
		const log = transport.getLatestLog();
		expect(log.label).equals(label);
		expect(log.message.startsWith(label));
	});
});

const setup = () => {
	const transport = new DebugTransport();
	const logger = winston.createLogger({
		format: labelFormat(),
		transports: [transport]
	});
	const message = faker.lorem.sentence();
	return {
		logger,
		transport,
		message
	};
};
