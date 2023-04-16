import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorLoopDetected extends APIError {

	static Config = HttpError[508];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorLoopDetectedInput) {
		super({
			code: 508,
			message: message || APIErrorLoopDetected.Config.message,
			errorCode,
			errorType: APIErrorLoopDetected.Config.type,
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

interface APIErrorLoopDetectedInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorLoopDetectedInput {
	condition: boolean;
}
