import express from "express";

import { router } from "./routes";
import {
	configureGlobalExceptionHandler,
	configureGraphQLServer,
	configureMiddlewares
} from "./utils";

export const app = express();

configureMiddlewares({ app });

configureGraphQLServer({ app });

app.use(router);

configureGlobalExceptionHandler({ app });
