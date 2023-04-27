import { GraphQLFieldConfig, GraphQLNonNull, GraphQLString } from "graphql";

import { DbDtoUser } from "@conduit/core";

import { Factory } from "../../../article/service/Factory";
import { ArticleType } from "../types";

const factory = new Factory();
const apiGetArticle = factory.newAPIGetArticle();

export const getArticle: GraphQLFieldConfig<unknown, Request, Args> = {
	type: ArticleType,
	description: "Get an article. Auth not required",
	args: {
		slug: { type: new GraphQLNonNull(GraphQLString) }
	},
	async resolve(_parent, args, req) {
		const slug = args.slug!;
		const { user } = req;
		const { article } = await apiGetArticle.execute({ slug, user });
		return article;
	}
};

type Args = {
	slug?: string;
};

interface Request {
	user?: DbDtoUser;
}
