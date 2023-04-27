import { Request, Response } from "express";
import { isNil } from "lodash";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputLogin } from "../dto";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiUserLogin = factory.newAPIUserLogin();

export const login = async (
	req: Request<unknown, unknown, Body, unknown>,
	res: Response
) => {
	const input: DtoInputLogin = req.body.user;

	APIErrorInternalServerError.assert({
		condition: !isNil(input),
		cause: new Error("The request body is missing")
	});

	const response = await apiUserLogin.execute({ input });
	return res.json(response);
};

interface Body {
	user: DtoInputLogin;
}
