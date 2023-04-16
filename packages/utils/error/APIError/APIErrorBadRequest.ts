import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorBadRequest extends APIError {

	static Config = HttpError[400];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorBadRequestInput) {
		super({
			code: 400,
			message: message || APIErrorBadRequest.Config.message,
			errorCode,
			errorType: APIErrorBadRequest.Config.type,
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

interface APIErrorBadRequestInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorBadRequestInput {
	condition: boolean;
}
