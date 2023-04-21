import { BaseError } from "@conduit/utils";

import { ErrorCodes } from "../UserConstants";

export class UserExistError extends BaseError {
	constructor({ details }: UserExistErrorConstructor) {
		super({
			code: ErrorCodes.UserExisted,
			message:
				"The provided email or username is already registered. Please use a different email or username.",
			details
		});
	}
}

interface UserExistErrorConstructor {
	details?: string[];
}
