import { Request, Response } from "express";

import { APIErrorInternalServerError } from "@conduit/utils/error/APIError";

import { DtoInputGetArticleFeed } from "../dto";
import { APIFeedArticlesOutput } from "../service/APIFeedArticles";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiFeedArticles = factory.newAPIFeedArticles();

export const getFeedArticles = async (
	req: Request<
		unknown,
		APIFeedArticlesOutput,
		unknown,
		DtoInputGetArticleFeed
	>,
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
	const input = req.query;
	const response = await apiFeedArticles.execute({ input, user });
	res.json(response);
};
