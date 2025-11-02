import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  college: text('college').notNull(),
  phone: text('phone'),
  createdAt: text('created_at').notNull(),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  imageUrl: text('image_url').notNull(),
  status: text('status').notNull().default('available'),
  createdAt: text('created_at').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  productId: integer('product_id').notNull().references(() => products.id),
  buyerId: integer('buyer_id').notNull().references(() => users.id),
  sellerId: integer('seller_id').notNull().references(() => users.id),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull(),
});