import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorPreconditionFailed extends APIError {
	static Config = HttpError[412];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorPreconditionFailedInput) {
		super({
			code: 412,
			message: message || APIErrorPreconditionFailed.Config.message,
			errorCode,
			errorType: APIErrorPreconditionFailed.Config.type,
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

interface APIErrorPreconditionFailedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorPreconditionFailedInput {
	condition: boolean;
}
