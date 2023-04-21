import { expect } from "chai";
import { isEqual } from "lodash";
import winston from "winston";

import { json } from "../../../logger/formats";
import { DebugTransport } from "./DebugTransport";

describe("Json", () => {
	it("should be able to include the JSON object in the message property of the info object", () => {
		const { logger, transport } = setup();
		const objectMessage = { hello: "world" };
		logger.info(objectMessage);
		const log = transport.getLatestLog();
		expect(isEqual(objectMessage, log.message));
	});
});

const setup = () => {
	const transport = new DebugTransport();
	const logger = winston.createLogger({
		format: json(),
		transports: [transport]
	});
	return {
		logger,
		transport
	};
};
