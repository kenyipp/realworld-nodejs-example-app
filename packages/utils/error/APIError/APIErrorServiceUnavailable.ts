import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorServiceUnavailable extends APIError {
	static Config = HttpError[503];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorServiceUnavailableInput) {
		super({
			code: 503,
			message: message || APIErrorServiceUnavailable.Config.message,
			errorCode,
			errorType: APIErrorServiceUnavailable.Config.type,
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

interface APIErrorServiceUnavailableInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorServiceUnavailableInput {
	condition: boolean;
}
