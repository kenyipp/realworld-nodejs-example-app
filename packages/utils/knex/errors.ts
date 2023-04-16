import stringify from "fast-json-stable-stringify";
import { serializeError } from "serialize-error";

export class CustomKnexError extends Error {

	constructor({ message }: CustomKnexErrorConstructor) {
		super(message);
		// Ensure the name of this error is the same as the class name
		this.name = this.constructor.name;
		// This clips the constructor invocation from the stack trace.
		// It's not absolutely essential, but it does make the stack trace a little nicer.
		Error.captureStackTrace(this, this.constructor);
	}

	static assert({ condition, message }: CustomKnexErrorInput) {
		if (!condition) {
			throw new this({ message });
		}
	}

	toString() {
		return stringify(serializeError(this));
	}

}

export interface CustomKnexErrorConstructor {
	message: string;
}

interface CustomKnexErrorInput {
	condition: boolean;
	message: string;
}
