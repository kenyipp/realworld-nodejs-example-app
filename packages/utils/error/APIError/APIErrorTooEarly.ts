import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorTooEarly extends APIError {
	static Config = HttpError[425];

	constructor({ message, errorCode, cause, payload }: APIErrorTooEarlyInput) {
		super({
			code: 425,
			message: message || APIErrorTooEarly.Config.message,
			errorCode,
			errorType: APIErrorTooEarly.Config.type,
			cause,
			payload
		});
	}

	static assert({
		condition,
		message,
		errorCode,
		cause,
		payload
	}: AssertInput): void {
		if (!condition) {
			throw new this({
				message,
				errorCode,
				cause,
				payload
			});
		}
	}
}

interface APIErrorTooEarlyInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorTooEarlyInput {
	condition: boolean;
}
