import {
	GraphQLBoolean,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLString
} from "graphql";

export const ProfileType = new GraphQLObjectType({
	name: "Profile",
	description: "Represents a user profile on a social network or platform",
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
		following: {
			type: new GraphQLNonNull(GraphQLBoolean),
			description:
				"Indicates whether the authenticated user is following this user"
		}
	})
});
