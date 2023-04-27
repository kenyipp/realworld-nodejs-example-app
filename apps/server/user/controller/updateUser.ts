import { Request, Response } from "express";
import { isNil } from "lodash";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputUpdateUser } from "../dto";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiUpdateUser = factory.newAPIUpdateUser();

export const updateUser = async (
	req: Request<unknown, unknown, Body, unknown>,
	res: Response
) => {
	const { user } = req;
	const updates = req.body.user;

	APIErrorInternalServerError.assert({
		condition: !isNil(user),
		cause: new Error("The user object is missing")
	});

	APIErrorInternalServerError.assert({
		condition: !isNil(updates),
		cause: new Error(
			"Missing request parameters 'userId' and/or request body"
		)
	});

	const response = await apiUpdateUser.execute({ user: user!, updates });
	return res.json(response);
};

interface Body {
	user: DtoInputUpdateUser;
}
