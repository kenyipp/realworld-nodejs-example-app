import { Request, Response } from "express";
import { isNil } from "lodash";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { Factory } from "../service/Factory";

const factory = new Factory();
const apiGetCurrentUser = factory.newAPIGetCurrentUser();

export const getCurrentUser = async (
	req: Request<unknown, unknown, unknown, unknown>,
	res: Response
) => {
	const { user } = req;

	APIErrorInternalServerError.assert({
		condition: !isNil(user),
		cause: new Error("The user object is missing")
	});

	const response = apiGetCurrentUser.execute({ dbDtoUser: user! });
	return res.json(response);
};
