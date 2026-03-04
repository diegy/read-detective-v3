exports.up = async function(knex) {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('openid').unique().index(); // WeChat openid
    table.string('unionid').unique().index(); // WeChat unionid
    table.string('nickname');
    table.string('avatar_url');
    table.string('phone');
    table.jsonb('reading_dna'); // Reading preferences vector
    table.text('bio');
    table.enum('status', ['active', 'inactive', 'banned']).defaultTo('active');
    table.timestamp('last_login_at');
    table.timestamps(true, true);
  });

  // Books table
  await knex.schema.createTable('books', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('isbn').unique().index();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.text('description');
    table.string('cover_url');
    table.jsonb('embedding'); // OpenAI embedding vector
    table.jsonb('metadata'); // publisher, year, pages, etc.
    table.timestamps(true, true);
  });

  // User-Book relationship
  await knex.schema.createTable('user_books', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('book_id').references('id').inTable('books').onDelete('CASCADE');
    table.enum('status', ['reading', 'finished', 'want_to_read', 'dropped']).defaultTo('want_to_read');
    table.integer('current_page').defaultTo(0);
    table.integer('total_pages');
    table.jsonb('folded_pages'); // Array of page numbers
    table.text('notes');
    table.float('rating'); // 1-5
    table.timestamp('started_at');
    table.timestamp('finished_at');
    table.timestamps(true, true);
    table.unique(['user_id', 'book_id']);
  });

  // Matches table
  await knex.schema.createTable('matches', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user1_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('user2_id').references('id').inTable('users').onDelete('CASCADE');
    table.float('similarity_score').notNullable();
    table.jsonb('common_books');
    table.jsonb('match_reason'); // AI-generated matching reason
    table.enum('status', ['pending', 'accepted', 'rejected', 'blocked']).defaultTo('pending');
    table.timestamp('matched_at').defaultTo(knex.fn.now());
    table.timestamps(true, true);
  });

  // Chat rooms
  await knex.schema.createTable('chat_rooms', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name');
    table.enum('type', ['direct', 'group', 'silence']).defaultTo('direct');
    table.uuid('match_id').references('id').inTable('matches');
    table.uuid('book_id').references('id').inTable('books'); // For book-specific rooms
    table.jsonb('participants'); // Array of user IDs
    table.timestamp('last_message_at');
    table.timestamps(true, true);
  });

  // Messages
  await knex.schema.createTable('messages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('room_id').references('id').inTable('chat_rooms').onDelete('CASCADE');
    table.uuid('sender_id').references('id').inTable('users').onDelete('SET NULL');
    table.text('content').notNullable();
    table.enum('type', ['text', 'image', 'system', 'ai']).defaultTo('text');
    table.jsonb('metadata'); // For AI messages, store model, tokens, etc.
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.index('room_id');
  });

  // AI Conversations (with AI assistant)
  await knex.schema.createTable('ai_conversations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('book_id').references('id').inTable('books');
    table.string('session_id').notNullable();
    table.jsonb('messages'); // Array of {role, content, timestamp}
    table.enum('type', ['book_summary', 'review', 'recommendation', 'general']).defaultTo('general');
    table.timestamps(true, true);
  });

  // Reading sessions (for silence room)
  await knex.schema.createTable('reading_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.uuid('room_id').references('id').inTable('chat_rooms').onDelete('CASCADE');
    table.uuid('book_id').references('id').inTable('books');
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('ended_at');
    table.integer('duration_seconds');
    table.integer('pages_read');
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('reading_sessions');
  await knex.schema.dropTableIfExists('ai_conversations');
  await knex.schema.dropTableIfExists('messages');
  await knex.schema.dropTableIfExists('chat_rooms');
  await knex.schema.dropTableIfExists('matches');
  await knex.schema.dropTableIfExists('user_books');
  await knex.schema.dropTableIfExists('books');
  await knex.schema.dropTableIfExists('users');
};
