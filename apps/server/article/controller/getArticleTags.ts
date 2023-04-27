import { Request, Response } from "express";

import { Factory } from "../service/Factory";

const factory = new Factory();
const apiGetTags = factory.newAPIGetTags();

export const getArticleTags = async (_req: Request, res: Response) => {
	const response = await apiGetTags.execute();
	return res.json(response);
};
