import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorGatewayTimeout extends APIError {

	static Config = HttpError[504];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorGatewayTimeoutInput) {
		super({
			code: 504,
			message: message || APIErrorGatewayTimeout.Config.message,
			errorCode,
			errorType: APIErrorGatewayTimeout.Config.type,
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

interface APIErrorGatewayTimeoutInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorGatewayTimeoutInput {
	condition: boolean;
}
