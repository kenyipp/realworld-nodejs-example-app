import { Express } from "express";
import { graphqlHTTP } from "express-graphql";

import { Environments, ServerPath } from "@conduit/types";

import { schema } from "../graphql/schema";

export const configureGraphQLServer = ({ app }: { app: Express }): void => {
	app.all(
		ServerPath.GraphQL,
		graphqlHTTP({
			schema,
			graphiql: process.env.NODE_ENV === Environments.Development
		})
	);
};
