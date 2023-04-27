import { Request, Response } from "express";
import { isNil } from "lodash";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { Factory } from "../service/Factory";

const factory = new Factory();
const apiUnfollowUser = factory.newAPIUnfollowUser();

export const unfollowUser = async (
	req: Request<Params, unknown, unknown, unknown>,
	res: Response
) => {
	const { user } = req;
	const { username } = req.params;

	APIErrorInternalServerError.assert({
		condition: !isNil(user),
		cause: new Error("The user object is missing'")
	});

	APIErrorInternalServerError.assert({
		condition: !isNil(username),
		cause: new Error("Missing request parameters 'username'")
	});

	const response = await apiUnfollowUser.execute({
		user: user!,
		username: username!
	});
	return res.json(response);
};

interface Params {
	username: string;
}
