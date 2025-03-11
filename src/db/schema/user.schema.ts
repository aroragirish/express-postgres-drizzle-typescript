import { pgTable, serial, varchar, timestamp, text, boolean } from 'drizzle-orm/pg-core';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password').notNull(),
  role: varchar('role', { length: 20 }).notNull().default(UserRole.USER),
  twoFactorSecret: text('two_factor_secret'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 