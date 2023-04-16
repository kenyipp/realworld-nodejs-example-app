import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorRequestedRangeNotSatisfiable extends APIError {

	static Config = HttpError[416];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorRequestedRangeNotSatisfiableInput) {
		super({
			code: 416,
			message: message || APIErrorRequestedRangeNotSatisfiable.Config.message,
			errorCode,
			errorType: APIErrorRequestedRangeNotSatisfiable.Config.type,
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

interface APIErrorRequestedRangeNotSatisfiableInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorRequestedRangeNotSatisfiableInput {
	condition: boolean;
}
