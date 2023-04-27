import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

export const UserType = new GraphQLObjectType({
	name: "User",
	description: "Represents a user on a social network or platform",
	fields: () => ({
		username: {
			type: new GraphQLNonNull(GraphQLString),
			description: "The unique username for the user"
		},
		email: {
			type: new GraphQLNonNull(GraphQLString),
			description: "The email address associated with the user account"
		},
		bio: {
			type: GraphQLString,
			description: "A brief biography or description of the user"
		},
		image: {
			type: GraphQLString,
			description:
				"The URL or path to the user's profile picture or avatar"
		},
		token: {
			type: GraphQLString,
			description:
				"The authentication token for the user, used for session management"
		}
	})
});
