import Router from "express-promise-router";
import path from "path";

import { ServerPath } from "@conduit/types";

import SwaggerJson from "./files/swagger.json";

export const router = Router();

router.get(ServerPath.GetSwaggerJson, (_req, res) => res.json(SwaggerJson));
router.get(ServerPath.Logo, (_req, res) =>
	res.type("png").sendFile(path.join(__dirname, "./files/logo.png"))
);
router.get(ServerPath.Documentation, (_req, res) =>
	res.type("html").sendFile(path.join(__dirname, "./files/reDoc.html"))
);
