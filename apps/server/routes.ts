import { ServerPath, Environments } from "@conduit/types";
import Router from "express-promise-router";
import { dangerouslyResetDb } from "@conduit/core";

import { router as userRouter } from "./user/route";
import { router as articleRouter } from "./article/route";

export const router = Router();

router.get(ServerPath.HealthCheck, (_req, res) => res.send("Ok"));

if ([Environments.CI, Environments.Testing, Environments.Development].includes(process.env.NODE_ENV)) {
	router.post(ServerPath.ResetServer, async (_req, res) => {
		await dangerouslyResetDb();
		res.send("Ok");
	});
}

router.use(userRouter);
router.use(articleRouter);
