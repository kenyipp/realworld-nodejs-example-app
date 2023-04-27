import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

import { GraphQLDate } from "../../scalars";
import { ProfileType } from "../../user/types/Profile";

export const CommentType = new GraphQLObjectType({
	name: "Comment",
	description: "Represents a comment on an article",
	fields: () => ({
		id: {
			type: new GraphQLNonNull(GraphQLString),
			description: "The unique identifier for the comment"
		},
		createdAt: {
			type: new GraphQLNonNull(GraphQLDate),
			description: "The date and time that the comment was created"
		},
		updatedAt: {
			type: new GraphQLNonNull(GraphQLDate),
			description: "The date and time that the comment was last updated"
		},
		body: {
			type: new GraphQLNonNull(GraphQLString),
			description: "The text or content of the comment"
		},
		author: {
			type: new GraphQLNonNull(ProfileType),
			description: "The author of the comment"
		}
	})
});
