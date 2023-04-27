import { Express } from "express";
import { graphqlHTTP } from "express-graphql";

import { Environments, ServerPath } from "@conduit/types";

import { schema } from "../graphql/schema";
import { auth } from "../middleware";

export const configureGraphQLServer = ({ app }: { app: Express }): void => {
	app.all(
		ServerPath.GraphQL,
		auth,
		graphqlHTTP({
			schema,
			graphiql: process.env.NODE_ENV === Environments.Development
		})
	);
};
