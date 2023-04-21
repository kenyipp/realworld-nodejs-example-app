import HttpError from "../constants/http-error.json";
import { APIError } from "./APIError";

export class APIErrorUnprocessableEntity extends APIError {
	static Config = HttpError[422];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorUnprocessableEntityInput) {
		super({
			code: 422,
			message: message || APIErrorUnprocessableEntity.Config.message,
			errorCode,
			errorType: APIErrorUnprocessableEntity.Config.type,
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

interface APIErrorUnprocessableEntityInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorUnprocessableEntityInput {
	condition: boolean;
}
