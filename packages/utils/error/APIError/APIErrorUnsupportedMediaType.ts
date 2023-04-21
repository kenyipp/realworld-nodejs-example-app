import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorUnsupportedMediaType extends APIError {
	static Config = HttpError[415];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorUnsupportedMediaTypeInput) {
		super({
			code: 415,
			message: message || APIErrorUnsupportedMediaType.Config.message,
			errorCode,
			errorType: APIErrorUnsupportedMediaType.Config.type,
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

interface APIErrorUnsupportedMediaTypeInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorUnsupportedMediaTypeInput {
	condition: boolean;
}
