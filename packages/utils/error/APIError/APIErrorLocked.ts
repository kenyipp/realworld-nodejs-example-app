import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorLocked extends APIError {

	static Config = HttpError[423];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorLockedInput) {
		super({
			code: 423,
			message: message || APIErrorLocked.Config.message,
			errorCode,
			errorType: APIErrorLocked.Config.type,
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

interface APIErrorLockedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorLockedInput {
	condition: boolean;
}
