import { type Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable("article_comment", (table) => {
		table.string("article_comment_id", 64).primary();
		table
			.string("article_id", 64)
			.references("article_id")
			.inTable("article")
			.index("FK-article_comment-article_id-article-article_id");
		table.text("body");
		table
			.string("user_id", 64)
			.references("user_id")
			.inTable("user")
			.index("FK-article_comment-user_id-user-user_id");
		table.string("rec_status", 1).defaultTo("A");
		table.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("article_comment");
}
