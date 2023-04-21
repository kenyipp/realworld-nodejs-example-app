import { BaseError } from "@conduit/utils";

import { ErrorCodes } from "../UserConstants";

export class InvalidFollowError extends BaseError {
	constructor({ message }: InvalidFollowErrorConstructor) {
		super({
			code: ErrorCodes.InvalidFollow,
			message
		});
	}
}
interface InvalidFollowErrorConstructor {
	message: string;
}
