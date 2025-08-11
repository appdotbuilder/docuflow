import { serial, text, pgTable, timestamp, integer, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Items table - stores the master list of items that can be submitted/received
export const itemsTable = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'), // Nullable by default
  category: text('category').notNull(),
  unit_of_measure: text('unit_of_measure').notNull(), // e.g., "pieces", "kg", "liters"
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Submissions table - records when items are submitted to the system
export const submissionsTable = pgTable('submissions', {
  id: serial('id').primaryKey(),
  item_id: integer('item_id').notNull().references(() => itemsTable.id),
  quantity: numeric('quantity', { precision: 10, scale: 3 }).notNull(), // Allow decimal quantities
  submitted_by: text('submitted_by').notNull(), // User identifier
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  notes: text('notes'), // Nullable by default
  batch_id: text('batch_id') // For grouping bulk submissions, nullable
});

// Receipts table - records when items are received from the system
export const receiptsTable = pgTable('receipts', {
  id: serial('id').primaryKey(),
  item_id: integer('item_id').notNull().references(() => itemsTable.id),
  quantity: numeric('quantity', { precision: 10, scale: 3 }).notNull(), // Allow decimal quantities
  received_by: text('received_by').notNull(), // User identifier
  received_at: timestamp('received_at').defaultNow().notNull(),
  notes: text('notes'), // Nullable by default
  batch_id: text('batch_id') // For grouping bulk receipts, nullable
});

// Define relations for proper query building
export const itemsRelations = relations(itemsTable, ({ many }) => ({
  submissions: many(submissionsTable),
  receipts: many(receiptsTable)
}));

export const submissionsRelations = relations(submissionsTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [submissionsTable.item_id],
    references: [itemsTable.id]
  })
}));

export const receiptsRelations = relations(receiptsTable, ({ one }) => ({
  item: one(itemsTable, {
    fields: [receiptsTable.item_id],
    references: [itemsTable.id]
  })
}));

// TypeScript types for the table schemas
export type Item = typeof itemsTable.$inferSelect;
export type NewItem = typeof itemsTable.$inferInsert;

export type Submission = typeof submissionsTable.$inferSelect;
export type NewSubmission = typeof submissionsTable.$inferInsert;

export type Receipt = typeof receiptsTable.$inferSelect;
export type NewReceipt = typeof receiptsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = { 
  items: itemsTable, 
  submissions: submissionsTable, 
  receipts: receiptsTable 
};

export const tableRelations = {
  itemsRelations,
  submissionsRelations,
  receiptsRelations
};