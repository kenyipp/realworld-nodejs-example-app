import { ServerPath } from "@conduit/types";
import Router from "express-promise-router";
import { router as userRouter } from "./user/route";
import { router as articleRouter } from "./article/route";

export const router = Router();

router.get(ServerPath.HealthCheck, (_req, res) => res.send("Ok"));

router.use(userRouter);
router.use(articleRouter);
