import { Request, Response } from "express";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { Factory } from "../service/Factory";

const factory = new Factory();
const apiDeleteComment = factory.newAPIDeleteComment();

export const deleteComment = async (
	req: Request<Params, unknown, unknown, unknown>,
	res: Response
) => {
	const { user } = req;
	const { id: commentId } = req.params;
	if (!user || !commentId) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiDeleteComment.execute({ commentId, user });
	return res.json(response);
};

interface Params {
	id: string;
}
