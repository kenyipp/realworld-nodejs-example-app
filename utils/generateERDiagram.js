"use strict";

const _ = require("lodash");
const knex = require("./database");

async function generateERDiagram(database) {
	const tables = await knex
		.raw(`
			SELECT
				TABLE_NAME,
				COLUMN_NAME,
				ORDINAL_POSITION,
				IS_NULLABLE,
				DATA_TYPE,
				EXTRA,
				COLUMN_KEY,
				COLUMN_COMMENT,
				COLUMN_DEFAULT
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_SCHEMA = ?;
		`, [database])
		.then((response) => response[0])
		.then((columns) => Object
			.entries(_.groupBy(columns, "TABLE_NAME"))
			.map((table) => {
				const [name, _columns] = table;

				const columnSetences = _columns
					.map((column) => {
						let sentence = `\t${column.COLUMN_NAME} ${column.DATA_TYPE}`;
						const tags = [];
						if (column.COLUMN_KEY === "PRI") {
							tags.push("pk");
						}
						if (column.EXTRA.includes("auto_increment")) {
							tags.push("increment");
						}
						if (column.COLUMN_DEFAULT) {
							tags.push(`default: "${column.COLUMN_DEFAULT}"`);
						}
						if (column.IS_NULLABLE === "YES") {
							tags.push("not null");
						}
						if (column.COLUMN_COMMENT !== "") {
							tags.push(`note: "${column.COLUMN_COMMENT}"`);
						}
						if (tags.length > 0) {
							sentence += ` [${tags.join(", ")}]`;
						}
						return sentence;
					});

				return `TABLE ${name} {\n${columnSetences.join("\n")}\n}`;
			})
			.join("\n"));

	const relations = await knex
		.raw(`
			SELECT
				CONSTRAINT_NAME,
				TABLE_NAME,
				CONSTRAINT_TYPE
			FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
			WHERE TABLE_SCHEMA = ? AND CONSTRAINT_TYPE = "FOREIGN KEY"
		`, [database])
		.then((response) => response[0])
		.then((keys) => keys
			.map((key) => {
				const [
					child,
					childColumn,
					parent,
					parentColumn = childColumn
				] = key.CONSTRAINT_NAME.split("_").slice(1);

				return `Ref: ${parent}.${parentColumn} > ${child}.${childColumn}`;
			})
			.join("\n"));

	return `${tables}\n\n${relations}`;
}

module.exports = generateERDiagram;
