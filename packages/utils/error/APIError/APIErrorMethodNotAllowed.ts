import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorMethodNotAllowed extends APIError {
	static Config = HttpError[405];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorMethodNotAllowedInput) {
		super({
			code: 405,
			message: message || APIErrorMethodNotAllowed.Config.message,
			errorCode,
			errorType: APIErrorMethodNotAllowed.Config.type,
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

interface APIErrorMethodNotAllowedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorMethodNotAllowedInput {
	condition: boolean;
}
