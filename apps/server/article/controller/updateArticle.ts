import { Request, Response } from "express";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputUpdateArticle } from "../dto";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiUpdateArticle = factory.newAPIUpdateArticle();

export const updateArticle = async (
	req: Request<Params, unknown, Body, unknown>,
	res: Response
) => {
	const { user } = req;
	const { slug } = req.params;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const input: DtoInputUpdateArticle = req.body.article;
	const response = await apiUpdateArticle.execute({ slug, user, input });
	return res.json(response);
};

interface Body {
	article: DtoInputUpdateArticle;
}

interface Params {
	slug: string;
}
