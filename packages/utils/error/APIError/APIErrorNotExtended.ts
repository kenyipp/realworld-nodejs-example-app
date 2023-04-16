import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorNotExtended extends APIError {

	static Config = HttpError[510];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorNotExtendedInput) {
		super({
			code: 510,
			message: message || APIErrorNotExtended.Config.message,
			errorCode,
			errorType: APIErrorNotExtended.Config.type,
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

interface APIErrorNotExtendedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorNotExtendedInput {
	condition: boolean;
}
