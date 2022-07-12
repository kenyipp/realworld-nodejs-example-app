"use strict";

const knex = require("knex");

const database = knex({
	client: "mysql",
	pool: {
		min: 2,
		max: 5
	},
	connection: {
		database: "RealWorldDb",
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT || 3306,
		user: process.env.DATABASE_USER,
		password: process.env.DATABASE_PASSWORD
	}
});

module.exports = database;
