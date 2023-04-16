import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorExpectationFailed extends APIError {

	static Config = HttpError[417];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorExpectationFailedInput) {
		super({
			code: 417,
			message: message || APIErrorExpectationFailed.Config.message,
			errorCode,
			errorType: APIErrorExpectationFailed.Config.type,
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

interface APIErrorExpectationFailedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorExpectationFailedInput {
	condition: boolean;
}
