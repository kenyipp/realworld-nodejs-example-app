import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorNotFound extends APIError {

	static Config = HttpError[404];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorNotFoundInput) {
		super({
			code: 404,
			message: message || APIErrorNotFound.Config.message,
			errorCode,
			errorType: APIErrorNotFound.Config.type,
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

interface APIErrorNotFoundInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorNotFoundInput {
	condition: boolean;
}
