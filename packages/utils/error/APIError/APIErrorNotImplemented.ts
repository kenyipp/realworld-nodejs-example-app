import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorNotImplemented extends APIError {

	static Config = HttpError[501];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorNotImplementedInput) {
		super({
			code: 501,
			message: message || APIErrorNotImplemented.Config.message,
			errorCode,
			errorType: APIErrorNotImplemented.Config.type,
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

interface APIErrorNotImplementedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorNotImplementedInput {
	condition: boolean;
}
