import { Request, Response } from "express";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputAddComment } from "../dto";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiAddComments = factory.newAPIAddComments();

export const addComment = async (
	req: Request<Params, unknown, Body, unknown>,
	res: Response
) => {
	const { user } = req;
	const { slug } = req.params;
	const input: DtoInputAddComment = req.body.comment;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiAddComments.execute({ slug, user, input });
	return res.json(response);
};

interface Body {
	comment: DtoInputAddComment;
}

interface Params {
	slug: string;
}
