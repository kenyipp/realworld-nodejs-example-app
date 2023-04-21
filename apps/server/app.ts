import express from "express";

import { router } from "./routes";
import { configureGlobalExceptionHandler, configureMiddlewares } from "./utils";

export const app = express();

configureMiddlewares({ app });

app.use(router);

configureGlobalExceptionHandler({ app });
