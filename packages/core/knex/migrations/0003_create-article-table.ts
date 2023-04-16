import { type Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex
		.schema
		.createTable(
			"article",
			(table) => {
				table.string("article_id", 64).primary();
				table.string("title", 120);
				table.string("slug", 120).unique().index("UX-article-slug");
				table.string("description", 250);
				table.text("body");
				table
					.string("user_id", 64)
					.references("user_id")
					.inTable("user")
					.index("FK-article-user_id-user-user_id");
				table.string("rec_status", 1).defaultTo("A");
				table.timestamps(true, true);
			}
		);
}

export async function down(knex: Knex): Promise<void> {
	await knex
		.schema
		.dropTable("article");
}
