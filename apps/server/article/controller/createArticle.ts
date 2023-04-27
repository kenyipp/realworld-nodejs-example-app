import { Request, Response } from "express";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputCreateArticle } from "../dto/DtoInputCreateArticle";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiCreateArticle = factory.newAPICreateArticle();

export const createArticle = async (
	req: Request<unknown, unknown, Body, unknown>,
	res: Response
) => {
	const { user } = req;
	if (!user) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const input = req.body.article;
	const response = await apiCreateArticle.execute({ input, user });
	res.json(response);
};

interface Body {
	article: DtoInputCreateArticle;
}
