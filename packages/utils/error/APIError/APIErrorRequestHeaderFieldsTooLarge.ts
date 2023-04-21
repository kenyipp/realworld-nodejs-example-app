import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorRequestHeaderFieldsTooLarge extends APIError {
	static Config = HttpError[431];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorRequestHeaderFieldsTooLargeInput) {
		super({
			code: 431,
			message:
				message || APIErrorRequestHeaderFieldsTooLarge.Config.message,
			errorCode,
			errorType: APIErrorRequestHeaderFieldsTooLarge.Config.type,
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

interface APIErrorRequestHeaderFieldsTooLargeInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorRequestHeaderFieldsTooLargeInput {
	condition: boolean;
}
