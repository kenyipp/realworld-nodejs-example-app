import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorMisdirectedRequest extends APIError {
	static Config = HttpError[421];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorMisdirectedRequestInput) {
		super({
			code: 421,
			message: message || APIErrorMisdirectedRequest.Config.message,
			errorCode,
			errorType: APIErrorMisdirectedRequest.Config.type,
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

interface APIErrorMisdirectedRequestInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorMisdirectedRequestInput {
	condition: boolean;
}
