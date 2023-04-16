import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorPreconditionRequired extends APIError {

	static Config = HttpError[428];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorPreconditionRequiredInput) {
		super({
			code: 428,
			message: message || APIErrorPreconditionRequired.Config.message,
			errorCode,
			errorType: APIErrorPreconditionRequired.Config.type,
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

interface APIErrorPreconditionRequiredInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorPreconditionRequiredInput {
	condition: boolean;
}
