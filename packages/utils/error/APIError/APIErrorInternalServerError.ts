import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorInternalServerError extends APIError {
	static Config = HttpError[500];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorInternalServerErrorInput) {
		super({
			code: 500,
			message: message || APIErrorInternalServerError.Config.message,
			errorCode,
			errorType: APIErrorInternalServerError.Config.type,
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

interface APIErrorInternalServerErrorInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorInternalServerErrorInput {
	condition: boolean;
}
