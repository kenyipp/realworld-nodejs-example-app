import stringify from "fast-json-stable-stringify";
import { serializeError } from "serialize-error";

export class BaseError extends Error {

	code?: string;
	details: string[] = [];

	constructor({ message, code, details }: BaseErrorConstructor) {
		super(message);
		this.code = code;
		this.details = details || [];
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace.
		// It's not absolutely essential, but it does make the stack trace a little nicer.
		Error.captureStackTrace(this, this.constructor);
	}

	static assert({
		condition, code, details, message
	}: AssertInput) {
		if (!condition) {
			throw new BaseError({ message, code, details });
		}
	}

	toString() {
		return stringify(serializeError(this));
	}

}

export interface BaseErrorConstructor {
	code?: string;
	message: string;
	details?: string[];
}

export type AssertInput = BaseErrorConstructor & {
	condition: boolean
};
