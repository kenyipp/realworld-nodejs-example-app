import { Request, Response } from "express";
import { isNil } from "lodash";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { Factory } from "../service/Factory";

const factory = new Factory();
const apiGetProfile = factory.newAPIGetProfile();

export const getProfile = async (
	req: Request<Params, unknown, unknown, unknown>,
	res: Response
) => {
	const { user } = req;
	const { username } = req.params;

	APIErrorInternalServerError.assert({
		condition: !isNil(username),
		cause: new Error("Missing request parameters 'username'")
	});

	const response = await apiGetProfile.execute({ user, username: username! });
	return res.json(response);
};

interface Params {
	username: string;
}
