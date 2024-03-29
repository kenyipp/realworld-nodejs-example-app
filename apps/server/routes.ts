import Router from "express-promise-router";

import { dangerouslyResetDb } from "@conduit/core";
import { Environments, ServerPath } from "@conduit/types";

import { router as articleRouter } from "./article/route";
import { router as assetsRouter } from "./assets/route";
import { router as userRouter } from "./user/route";

export const router = Router();

router.get(ServerPath.HealthCheck, (_req, res) => res.send("Ok"));

if (
	process.env.NODE_ENV === Environments.CI ||
	process.env.NODE_ENV === Environments.Development
) {
	/* istanbul ignore next */
	router.post(ServerPath.ResetServer, async (_req, res) => {
		await dangerouslyResetDb();
		res.send("Ok");
	});
}

router.use(userRouter).use(articleRouter).use(assetsRouter);
