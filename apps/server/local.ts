import dotenv from "dotenv";
import { expand } from "dotenv-expand";

import { appConfig } from "@conduit/config";
import { logger } from "@conduit/utils";

import { app } from "./app";

const env = dotenv.config();
expand(env);

app.listen(appConfig.server.port, () => {
	logger.info(`The server listens at port ${appConfig.server.port}`, {
		label: "App"
	});
});
