import express from "express";
import { router } from "./route";
import {
	configureMiddlewares,
	configureGlobalExceptionHandler
} from "../utils";

export const app = express();

configureMiddlewares({ app });

app.use(router);

configureGlobalExceptionHandler({ app });
