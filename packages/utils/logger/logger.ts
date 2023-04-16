import winston, { format, transports } from "winston";
import { Environments } from "@conduit/types";
import {
	cleanStack,
	capitalizeLevel,
	label,
	customPrintf,
	environment
} from "./formats";

const {
	timestamp,
	errors,
	json,
	combine,
	colorize,
	metadata
} = format;

const {
	Console
} = transports;

const isProduction = process.env.NODE_ENV === Environments.Production;

/**
 *
 * @remarks
 * The levels used by npm for logging are prioritized from highest to lowest as follows:
 * error: 0,
 * warn: 1,
 * info: 2,
 * http: 3,
 * verbose: 4,
 * debug: 5,
 * silly: 6
 *
 */
const { levels } = winston.config.npm;

export const logger = winston.createLogger({
	// Set the log level to "info" in production, or use the LOG_LEVEL environment variable in other environments
	level: isProduction ? "info" : process.env.LOG_LEVEL || "debug",
	levels,
	// Use the Console transport with a custom format
	transports: [
		new Console({
			format: combine(
				label({ colorify: true }),
				capitalizeLevel(),
				colorize(),
				customPrintf()
			)
		})
	],
	// Define the default log format options
	format: format.combine(
		timestamp(),
		environment(),
		cleanStack({}),
		errors({ stack: true }),
		json(),
		metadata({
			key: "payload",
			fillExcept: [
				"label",
				"timestamp",
				"message",
				"level",
				"stack",
				"environment"
			]
		})
	),
	// Don't exit the process when a handled exception occurs
	exitOnError: false,
	silent: false
});
