import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  words: text('words').notNull(),
  emotion: text('emotion').notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
});