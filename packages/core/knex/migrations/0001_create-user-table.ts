import { type Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex
		.schema
		.createTable(
			"user",
			(table) => {
				table.string("user_id", 64).primary();
				table.string("username", 64).unique().notNullable();
				table.string("email", 250).unique().notNullable();
				table.text("bio");
				table.text("image");
				table.string("hash", 64).notNullable();
				table.enum("status_id", ["normal", "banned"]).notNullable().defaultTo("normal");
				table.timestamps(true, true);
			}
		);
}

export async function down(knex: Knex): Promise<void> {
	await knex
		.schema
		.dropTable("user");
}
