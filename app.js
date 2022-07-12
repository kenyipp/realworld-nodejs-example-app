"use strict";

require("./utils/bootstrap");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const methodOverride = require("method-override");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const app = express();

if (!IS_PRODUCTION) {
	app.use(morgan("tiny"));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(methodOverride());

app.use(
	helmet.contentSecurityPolicy({
		useDefaults: true,
		directives: {
			scriptSrc: ["'self'", "cdn.jsdelivr.net", "'unsafe-inline'"],
			workerSrc: ["*", "blob:"]
		}
	}),
	express.static("public")
);

app.use("/api", require("./index.route"));

module.exports = app;
