import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorUnauthorized extends APIError {
	static Config = HttpError[401];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorUnauthorizedInput) {
		super({
			code: 401,
			message: message || APIErrorUnauthorized.Config.message,
			errorCode,
			errorType: APIErrorUnauthorized.Config.type,
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

interface APIErrorUnauthorizedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorUnauthorizedInput {
	condition: boolean;
}
