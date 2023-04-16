import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorNotAcceptable extends APIError {

	static Config = HttpError[406];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorNotAcceptableInput) {
		super({
			code: 406,
			message: message || APIErrorNotAcceptable.Config.message,
			errorCode,
			errorType: APIErrorNotAcceptable.Config.type,
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

interface APIErrorNotAcceptableInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorNotAcceptableInput {
	condition: boolean;
}
