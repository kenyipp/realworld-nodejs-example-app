import {
	GraphQLBoolean,
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} from "graphql";

import { GraphQLDate } from "../../scalars";
import { ProfileType } from "../../user/types/Profile";

export const ArticleType = new GraphQLObjectType({
	name: "Article",
	description: "Represents an article published on a blog or website",
	fields: () => ({
		slug: {
			type: GraphQLString,
			description: "The unique URL slug for the article"
		},
		title: {
			type: GraphQLString,
			description: "The title of the article"
		},
		description: {
			type: GraphQLString,
			description: "A short summary or description of the article"
		},
		body: {
			type: GraphQLString,
			description: "The full text or content of the article"
		},
		createdAt: {
			type: new GraphQLNonNull(GraphQLDate),
			description:
				"The date and time that the article was created (as a Unix timestamp)"
		},
		updatedAt: {
			type: new GraphQLNonNull(GraphQLDate),
			description:
				"The date and time that the article was last updated (as a Unix timestamp)"
		},
		favorited: {
			type: GraphQLBoolean,
			description:
				"Indicates whether the article has been favorited by the user"
		},
		favoritesCount: {
			type: GraphQLInt,
			description: "The number of times the article has been favorited"
		},
		author: {
			type: ProfileType,
			description: "The author of the article"
		},
		tagList: {
			type: new GraphQLList(GraphQLString),
			description:
				"A list of tags or keywords associated with the article"
		}
	})
});
