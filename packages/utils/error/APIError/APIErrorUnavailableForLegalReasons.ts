import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorUnavailableForLegalReasons extends APIError {
	static Config = HttpError[451];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorUnavailableForLegalReasonsInput) {
		super({
			code: 451,
			message:
				message || APIErrorUnavailableForLegalReasons.Config.message,
			errorCode,
			errorType: APIErrorUnavailableForLegalReasons.Config.type,
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

interface APIErrorUnavailableForLegalReasonsInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorUnavailableForLegalReasonsInput {
	condition: boolean;
}
