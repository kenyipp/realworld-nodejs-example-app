import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorUpgradeRequired extends APIError {

	static Config = HttpError[426];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorUpgradeRequiredInput) {
		super({
			code: 426,
			message: message || APIErrorUpgradeRequired.Config.message,
			errorCode,
			errorType: APIErrorUpgradeRequired.Config.type,
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

interface APIErrorUpgradeRequiredInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorUpgradeRequiredInput {
	condition: boolean;
}
