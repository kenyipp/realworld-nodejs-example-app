import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorFailedDependency extends APIError {

	static Config = HttpError[424];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorFailedDependencyInput) {
		super({
			code: 424,
			message: message || APIErrorFailedDependency.Config.message,
			errorCode,
			errorType: APIErrorFailedDependency.Config.type,
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

interface APIErrorFailedDependencyInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorFailedDependencyInput {
	condition: boolean;
}
