import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorVariantAlsoNegotiates extends APIError {
	static Config = HttpError[506];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorVariantAlsoNegotiatesInput) {
		super({
			code: 506,
			message: message || APIErrorVariantAlsoNegotiates.Config.message,
			errorCode,
			errorType: APIErrorVariantAlsoNegotiates.Config.type,
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

interface APIErrorVariantAlsoNegotiatesInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorVariantAlsoNegotiatesInput {
	condition: boolean;
}
