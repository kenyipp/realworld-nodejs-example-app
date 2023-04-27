import { GraphQLObjectType, GraphQLSchema } from "graphql";

import * as article from "./article";

const Query = new GraphQLObjectType({
	name: "Query",
	fields: {
		article: article.query.getArticle,
		articles: article.query.getArticles
	}
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		createArticle: article.mutation.createArticle
	}
});

export const schema = new GraphQLSchema({ query: Query, mutation: Mutation });
