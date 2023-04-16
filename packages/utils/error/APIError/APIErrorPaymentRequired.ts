import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorPaymentRequired extends APIError {

	static Config = HttpError[402];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorPaymentRequiredInput) {
		super({
			code: 402,
			message: message || APIErrorPaymentRequired.Config.message,
			errorCode,
			errorType: APIErrorPaymentRequired.Config.type,
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

interface APIErrorPaymentRequiredInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorPaymentRequiredInput {
	condition: boolean;
}
