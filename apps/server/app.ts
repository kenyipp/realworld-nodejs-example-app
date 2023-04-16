import express from "express";
import {
	configureMiddlewares,
	configureGlobalExceptionHandler
} from "./utils";
import { router } from "./routes";

export const app = express();

configureMiddlewares({ app });

app.use(router);

configureGlobalExceptionHandler({ app });
