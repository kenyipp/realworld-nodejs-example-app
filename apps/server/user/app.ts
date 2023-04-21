import express from "express";

import {
	configureGlobalExceptionHandler,
	configureMiddlewares
} from "../utils";
import { router } from "./route";

export const app = express();

configureMiddlewares({ app });

app.use(router);

configureGlobalExceptionHandler({ app });
