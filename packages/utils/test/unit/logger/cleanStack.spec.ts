import { expect } from "chai";
import winston from "winston";

import { cleanStack } from "../../../logger/formats";
import { DebugTransport } from "./DebugTransport";

describe("CleanStack", () => {
	it("should remove the unnecessary error message from the error stack", () => {
		const { logger, transport, error } = setup();
		const originalStackLength = error.stack!.split("\n").length;
		logger.error(error);
		const log = transport.getLatestLog();
		const newStackLength = log.message.stack.split("\n").length;
		expect(newStackLength).lessThanOrEqual(originalStackLength);
	});
});

const setup = () => {
	const transport = new DebugTransport();
	const logger = winston.createLogger({
		format: cleanStack(),
		transports: [transport]
	});
	const error = new Error();
	return {
		logger,
		transport,
		error
	};
};
