import { APIError } from "./APIError";
import HttpError from "../constants/http-error.json";

export class APIErrorBadGateway extends APIError {

	static Config = HttpError[502];

	constructor({
		message,
		errorCode,
		cause,
		payload
	}: APIErrorBadGatewayInput) {
		super({
			code: 502,
			message: message || APIErrorBadGateway.Config.message,
			errorCode,
			errorType: APIErrorBadGateway.Config.type,
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

interface APIErrorBadGatewayInput {
	message?: string;
	errorCode?: string;
	cause?: Error;
	payload?: any;
}

interface AssertInput extends APIErrorBadGatewayInput {
	condition: boolean;
}
