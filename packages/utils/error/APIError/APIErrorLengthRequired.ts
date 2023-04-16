import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorLengthRequired extends APIError {

	static Config = HttpError[411];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorLengthRequiredInput) {
		super({
			code: 411,
			message: message || APIErrorLengthRequired.Config.message,
			errorCode,
			errorType: APIErrorLengthRequired.Config.type,
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

interface APIErrorLengthRequiredInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorLengthRequiredInput {
	condition: boolean;
}
