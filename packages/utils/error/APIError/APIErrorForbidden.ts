import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorForbidden extends APIError {
	static Config = HttpError[403];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorForbiddenInput) {
		super({
			code: 403,
			message: message || APIErrorForbidden.Config.message,
			errorCode,
			errorType: APIErrorForbidden.Config.type,
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

interface APIErrorForbiddenInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorForbiddenInput {
	condition: boolean;
}
