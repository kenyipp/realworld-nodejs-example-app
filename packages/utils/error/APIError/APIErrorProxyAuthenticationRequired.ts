import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorProxyAuthenticationRequired extends APIError {
	static Config = HttpError[407];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorProxyAuthenticationRequiredInput) {
		super({
			code: 407,
			message:
				message || APIErrorProxyAuthenticationRequired.Config.message,
			errorCode,
			errorType: APIErrorProxyAuthenticationRequired.Config.type,
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

interface APIErrorProxyAuthenticationRequiredInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorProxyAuthenticationRequiredInput {
	condition: boolean;
}
