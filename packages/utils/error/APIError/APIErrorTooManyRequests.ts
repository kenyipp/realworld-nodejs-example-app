import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorTooManyRequests extends APIError {
	static Config = HttpError[429];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorTooManyRequestsInput) {
		super({
			code: 429,
			message: message || APIErrorTooManyRequests.Config.message,
			errorCode,
			errorType: APIErrorTooManyRequests.Config.type,
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

interface APIErrorTooManyRequestsInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorTooManyRequestsInput {
	condition: boolean;
}
