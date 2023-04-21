import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorRequestEntityTooLarge extends APIError {
	static Config = HttpError[413];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorRequestEntityTooLargeInput) {
		super({
			code: 413,
			message: message || APIErrorRequestEntityTooLarge.Config.message,
			errorCode,
			errorType: APIErrorRequestEntityTooLarge.Config.type,
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

interface APIErrorRequestEntityTooLargeInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorRequestEntityTooLargeInput {
	condition: boolean;
}
