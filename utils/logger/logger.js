"use strict";

const path = require("path");
const colors = require("colors");
const winston = require("winston");

const { format } = winston;

const CustomTransport = require("./CustomTransport");

const logger = winston.createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	levels: winston.config.npm.levels,
	format: format.combine(
		format.timestamp(),
		format.json(),
		format.errors({ stack: true })
	),
	transports: [
		new winston.transports.Console({
			format: format.combine(
				format.colorize(),
				format.printf((info) => {
					let message = `${info.level} ${info.label ? colors.grey(`[${info.label}] `) : ""}${info.message} ${colors.grey(`- ${info.timestamp}`)}`;

					if (info.stack) {
						const pwd = path.resolve(process.env.PWD || process.cwd());

						const stackMessage = info
							.stack
							.split("\n")
							.slice(1)
							.map((line, index) => {
								if (index === 0 || (!line.includes("node_modules") && line.includes(pwd))) {
									return line;
								}
								return colors.grey(line);
							})
							.join("\n");

						message += `\n${stackMessage}`;
					}

					return message;
				})
			)
		}),
		new CustomTransport({ level: "info" })
	]
});

module.exports = logger;
