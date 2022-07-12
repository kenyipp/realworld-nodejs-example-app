"use strict";

const PromiseRouter = require("express-promise-router");
const controller = require("./tag.controller");

const router = PromiseRouter();

router.get("/", controller.list);

module.exports = router;
