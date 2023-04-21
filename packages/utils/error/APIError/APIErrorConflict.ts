import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorConflict extends APIError {
	static Config = HttpError[409];

	constructor({ message, errorCode, cause, payload }: APIErrorConflictInput) {
		super({
			code: 409,
			message: message || APIErrorConflict.Config.message,
			errorCode,
			errorType: APIErrorConflict.Config.type,
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

interface APIErrorConflictInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorConflictInput {
	condition: boolean;
}
