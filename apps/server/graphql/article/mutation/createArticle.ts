import {
	GraphQLFieldConfig,
	GraphQLList,
	GraphQLNonNull,
	GraphQLString
} from "graphql";

import { DbDtoUser } from "@conduit/core";

import { DtoInputCreateArticle } from "../../../article/dto";
import { createArticleSchema } from "../../../article/schema";
import { Factory } from "../../../article/service/Factory";
import { ArticleType } from "../types";

const factory = new Factory();
const apiCreateArticle = factory.newAPICreateArticle();

export const createArticle: GraphQLFieldConfig<unknown, Request> = {
	type: ArticleType,
	description: "Create an article. Auth is required.",
	args: {
		title: { type: new GraphQLNonNull(GraphQLString) },
		description: { type: new GraphQLNonNull(GraphQLString) },
		body: { type: new GraphQLNonNull(GraphQLString) },
		tagList: { type: new GraphQLList(GraphQLString) }
	},
	async resolve(_parent, args, req) {
		const { user } = req;
		if (!user) {
			throw new Error(
				"Authentication required. Please provide valid credentials to access this resource."
			);
		}
		const { value, error } = createArticleSchema.validate({
			article: args
		});
		if (error) {
			throw error;
		}
		const input: DtoInputCreateArticle = value.article;
		const { article } = await apiCreateArticle.execute({ input, user });
		return article;
	}
};

interface Request {
	user?: DbDtoUser;
}
