import {
	GraphQLFieldConfig,
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLString
} from "graphql";

import { DbDtoUser } from "@conduit/core";

import { DtoInputGetArticles } from "../../../article/dto/DtoInputGetArticles";
import { Factory } from "../../../article/service/Factory";
import { ArticleType } from "../types";

const factory = new Factory();
const apiListArticles = factory.newAPIListArticles();

export const getArticles: GraphQLFieldConfig<unknown, Request, Args> = {
	description:
		"Get most recent articles globally. Use query parameters to filter results. Auth is optional",
	type: new GraphQLObjectType({
		name: "GetArticlesResponse",
		description:
			"The response object for a query that retrieves a list of articles.",
		fields: () => ({
			articles: {
				type: new GraphQLList(ArticleType),
				description: "A list of articles that match the query."
			},
			articlesCount: {
				type: GraphQLInt,
				description:
					"The total number of articles that match the query."
			}
		})
	}),
	args: {
		limit: { type: GraphQLInt },
		offset: { type: GraphQLInt },
		tag: { type: GraphQLString },
		author: { type: GraphQLString },
		favorited: { type: GraphQLString }
	},
	async resolve(_parent, args, req) {
		const { user } = req;
		const input: DtoInputGetArticles = {
			limit: args.limit || 20,
			offset: args.offset || 0,
			...args
		};
		const response = await apiListArticles.execute({ input, user });
		return response;
	}
};

interface Args {
	limit?: number;
	offset?: number;
	tag?: string;
	author?: string;
	favorited?: string;
}

interface Request {
	user?: DbDtoUser;
}
