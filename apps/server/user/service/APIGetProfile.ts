import { isNil } from "lodash";

import { DbDtoUser } from "@conduit/core/database/dto";
import { UserService } from "@conduit/core/service";
import { APIErrorNotFound } from "@conduit/utils";

import { ErrorCodes } from "../../constants";
import { DtoProfile } from "../dto";

export class APIGetProfile {
	private userService: UserService;

	constructor({ userService }: APIGetProfileConstructor) {
		this.userService = userService;
	}

	/**
	 *
	 * Retrieves the profile information for a given username.
	 *
	 * @param {APIGetProfileInput} input - The input data for the API call.
	 *
	 * @returns {Promise<APIGetProfileOutput>} The output data for the API call.
	 * @throws {APIErrorNotFound} If the targeted user cannot be found.
	 *
	 */
	async execute({
		user,
		username
	}: APIGetProfileInput): Promise<APIGetProfileOutput> {
		const targeted = await this.userService.getUserByUsername({ username });
		APIErrorNotFound.assert({
			condition: !isNil(targeted),
			errorCode: ErrorCodes.NotFound,
			message: "Sorry, we could not find the user you are looking for."
		});
		const following = user
			? await this.userService.isFollowing({
					followerId: user.id,
					followingId: targeted.id
			  })
			: false;
		const profile = new DtoProfile({ dbDtoUser: targeted, following });
		return { profile };
	}
}

interface APIGetProfileConstructor {
	userService: UserService;
}

interface APIGetProfileInput {
	username: string;
	user?: DbDtoUser;
}

interface APIGetProfileOutput {
	profile: DtoProfile;
}
