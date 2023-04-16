import Knex from "knex";
import sqlString from "sqlstring";
import { CustomKnexError } from "./errors";

Knex.QueryBuilder.extend("if", function ifFunction(condition: string, trueValue: any, falseValue: any) {
	const engine = this.client.config.client;

	CustomKnexError.assert({
		condition: typeof engine === "string" && ["better-sqlite3", "mysql", "mysql2"].includes(engine),
		message: "The client type provided is invalid. The supported clients are limited to better-sqlite3, mysql, and mysql2."
	});

	let ifOperator: string;

	switch (engine) {
		case "better-sqlite3":
			ifOperator = "IFF";
			break;
		case "mysql":
		case "mysql2":
		default:
			ifOperator = "IF";
			break;
	}
	return this.fromRaw(`${ifOperator}(${condition}, ${sqlString.escape(trueValue)}, ${sqlString.escape(falseValue)})`);
});

export = Knex;
