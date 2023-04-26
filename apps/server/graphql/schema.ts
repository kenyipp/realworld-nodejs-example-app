import {
	GraphQLInt,
	GraphQLList,
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLString
} from "graphql";

import { ServiceFactory as ArticleServiceFactory } from "../article/Factory";
import { DtoInputGetArticles } from "../article/dto";
import { ArticleType } from "./types/Article";

const articleFactory = new ArticleServiceFactory();

const apiGetArticle = articleFactory.newAPIGetArticle();
const apiListArticles = articleFactory.newAPIListArticles();

const Query = new GraphQLObjectType({
	name: "Query",
	fields: {
		article: {
			description: "Get an article. Auth not required",
			type: ArticleType,
			args: {
				slug: { type: GraphQLString }
			},
			async resolve(_parent, args, req) {
				const { slug } = args;
				const { user } = req;
				const { article } = await apiGetArticle.execute({ slug, user });
				return article;
			}
		},
		articles: {
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
		}
	}
});

export const schema = new GraphQLSchema({ query: Query });
