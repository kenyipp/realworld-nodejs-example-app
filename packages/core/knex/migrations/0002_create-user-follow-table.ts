import { type Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	return knex
		.schema
		.createTable(
			"user_follow",
			(table) => {
				table
					.string("user_follow_id", 64)
					.comment("Unique identifier for each following record")
					.primary();
				table
					.string("follower_id", 64)
					.comment("ID of the user who is following");
				table
					.string("following_id", 64)
					.comment("ID of the user who is being followed");
				table.string("rec_status", 10).defaultTo("A");
				table.timestamps(true, true);
				table.unique(["follower_id", "following_id"], { indexName: "UX-user_following-follower_id-following_id" });
			}
		);
}

export async function down(knex: Knex): Promise<void> {
	await knex
		.schema
		.dropTable("user_follow");
}
