import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorHTTPVersionNotSupported extends APIError {
	static Config = HttpError[505];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorHTTPVersionNotSupportedInput) {
		super({
			code: 505,
			message: message || APIErrorHTTPVersionNotSupported.Config.message,
			errorCode,
			errorType: APIErrorHTTPVersionNotSupported.Config.type,
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

interface APIErrorHTTPVersionNotSupportedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorHTTPVersionNotSupportedInput {
	condition: boolean;
}
