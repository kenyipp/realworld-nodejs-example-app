import { type Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex
		.schema
		.createTable(
			"article_favorite",
			(table) => {
				table.string("article_favorite_id", 64).primary();
				table
					.string("user_id", 64)
					.references("user_id")
					.inTable("user")
					.index("FK-article_favorite-user_id-user-user_id");
				table
					.string("article_id", 64)
					.references("article_id")
					.inTable("article")
					.index("FK-article_favorite-article_id-article-article_id");
				table.string("rec_status", 1).defaultTo("A");
				table.timestamps(true, true);
				table.unique(["user_id", "article_id"], { indexName: "UX-article_favorite-user_id-article_id" });
			}
		);
}

export async function down(knex: Knex): Promise<void> {
	await knex
		.schema
		.dropTable("article_favorite");
}
