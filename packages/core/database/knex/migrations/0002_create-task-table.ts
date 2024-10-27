import { type Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('task', (table) => {
    table
      .string('agent_id', 64)
      .comment(
        'The ID of the user who triggered the activity exists only if the process was triggered via the admin portal.'
      );
    table
      .integer('progress')
      .comment(
        'The progress of the activity processing. It may not be available for all types of activities.'
      );
    table.string('message').comment('The message returned by the task processing.');
    table
      .string('failed_reason')
      .comment(
        'The reason for the task processing failure. It is empty if the task was successful.'
      );
    table.text('return_data').comment('The data returned by the task processing.');
    table
      .timestamp('processed_at')
      .nullable()
      .comment('The date and time when the activity was processed.');
    table
      .timestamp('finished_at')
      .nullable()
      .comment(
        'The date and time when the activity was finished. No matter if it was successful or failed.'
      );
    table
      .string('type')
      .notNullable()
      .index()
      .comment('The type of activity that was triggered.');
    table
      .json('payload')
      .comment(
        'The request payload of the activity can vary depending on the activity type.'
      );
    table
      .string('process_status')
      .notNullable()
      .defaultTo('pending')
      .index()
      .comment('The status of the activity processing.');
    table
      .string('record_status')
      .notNullable()
      .defaultTo('active')
      .comment('The status of the record.')
      .index();
    // Add timestamps for created_at and updated_at
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('task');
}
