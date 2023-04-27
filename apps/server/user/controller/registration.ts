import { Request, Response } from "express";
import { isNil } from "lodash";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputRegistration } from "../dto";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiRegistration = factory.newAPIRegistration();

export const registration = async (
	req: Request<unknown, unknown, Body, unknown>,
	res: Response
) => {
	const input: DtoInputRegistration = req.body.user;

	APIErrorInternalServerError.assert({
		condition: !isNil(input),
		cause: new Error("The request body is missing")
	});

	const response = await apiRegistration.execute({ input });
	return res.json(response);
};

interface Body {
	user: DtoInputRegistration;
}
