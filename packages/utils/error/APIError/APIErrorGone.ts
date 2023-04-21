import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorGone extends APIError {
	static Config = HttpError[410];

	constructor({ message, errorCode, cause, payload }: APIErrorGoneInput) {
		super({
			code: 410,
			message: message || APIErrorGone.Config.message,
			errorCode,
			errorType: APIErrorGone.Config.type,
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

interface APIErrorGoneInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorGoneInput {
	condition: boolean;
}
