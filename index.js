"use strict";

const app = require("./app");
const logger = require("./utils/logger");

const PORT = process.env.APP_PORT || 3100;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

app.listen(
	PORT,
	(error) => {
		if (error) {
			return logger.error(error);
		}
		return logger[IS_PRODUCTION ? "info" : "debug"](`The server listens at port ${PORT}`, { label: "App" });
	}
);
