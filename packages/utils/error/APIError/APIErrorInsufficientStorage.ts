import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorInsufficientStorage extends APIError {

	static Config = HttpError[507];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorInsufficientStorageInput) {
		super({
			code: 507,
			message: message || APIErrorInsufficientStorage.Config.message,
			errorCode,
			errorType: APIErrorInsufficientStorage.Config.type,
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

interface APIErrorInsufficientStorageInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorInsufficientStorageInput {
	condition: boolean;
}
