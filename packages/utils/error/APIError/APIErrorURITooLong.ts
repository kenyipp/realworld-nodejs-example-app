import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorURITooLong extends APIError {
	static Config = HttpError[414];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorURITooLongInput) {
		super({
			code: 414,
			message: message || APIErrorURITooLong.Config.message,
			errorCode,
			errorType: APIErrorURITooLong.Config.type,
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

interface APIErrorURITooLongInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorURITooLongInput {
	condition: boolean;
}
