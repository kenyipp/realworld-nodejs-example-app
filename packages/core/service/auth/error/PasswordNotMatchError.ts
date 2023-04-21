import { BaseError } from "@conduit/utils";

import { ErrorCodes } from "../AuthConstants";

export class PasswordNotMatchError extends BaseError {
	constructor() {
		super({
			code: ErrorCodes.PasswordNotMatch,
			message: "Passwords do not match. Please try again."
		});
	}
}
