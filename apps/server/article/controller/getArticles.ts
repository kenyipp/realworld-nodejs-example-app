import { Request, Response } from "express";

import { DtoInputGetArticles } from "../dto/DtoInputGetArticles";
import { APIListArticlesOutput } from "../service/APIListArticles";
import { Factory } from "../service/Factory";

const factory = new Factory();
const apiListArticles = factory.newAPIListArticles();

export const getArticles = async (
	req: Request<unknown, APIListArticlesOutput, unknown, DtoInputGetArticles>,
	res: Response
) => {
	const { user } = req;
	const input = req.query as unknown as DtoInputGetArticles;
	const response = await apiListArticles.execute({ input, user });
	res.json(response);
};
