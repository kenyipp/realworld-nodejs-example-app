import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorNetworkAuthenticationRequired extends APIError {

	static Config = HttpError[511];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorNetworkAuthenticationRequiredInput) {
		super({
			code: 511,
			message: message || APIErrorNetworkAuthenticationRequired.Config.message,
			errorCode,
			errorType: APIErrorNetworkAuthenticationRequired.Config.type,
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

interface APIErrorNetworkAuthenticationRequiredInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorNetworkAuthenticationRequiredInput {
	condition: boolean;
}
