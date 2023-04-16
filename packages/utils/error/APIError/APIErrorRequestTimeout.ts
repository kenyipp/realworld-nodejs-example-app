import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorRequestTimeout extends APIError {

	static Config = HttpError[408];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorRequestTimeoutInput) {
		super({
			code: 408,
			message: message || APIErrorRequestTimeout.Config.message,
			errorCode,
			errorType: APIErrorRequestTimeout.Config.type,
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

interface APIErrorRequestTimeoutInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorRequestTimeoutInput {
	condition: boolean;
}
