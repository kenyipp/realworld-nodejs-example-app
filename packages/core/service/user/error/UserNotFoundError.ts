import { BaseError } from "@conduit/utils";
import { ErrorCodes } from "../UserConstants";

export class UserNotFoundError extends BaseError {

	constructor() {
		super({
			code: ErrorCodes.UserNotFound,
			message: "Sorry, we could not find an user with that information. Please try again with a different email or username"
		});
	}

}
