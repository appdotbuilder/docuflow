import { z } from 'zod';

// Item schema for database representation
export const itemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  unit_of_measure: z.string(), // e.g., "pieces", "kg", "liters"
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Item = z.infer<typeof itemSchema>;

// Submission schema for database representation
export const submissionSchema = z.object({
  id: z.number(),
  item_id: z.number(),
  quantity: z.number(),
  submitted_by: z.string(), // User identifier
  submitted_at: z.coerce.date(),
  notes: z.string().nullable(),
  batch_id: z.string().nullable() // For grouping bulk submissions
});

export type Submission = z.infer<typeof submissionSchema>;

// Receipt schema for database representation
export const receiptSchema = z.object({
  id: z.number(),
  item_id: z.number(),
  quantity: z.number(),
  received_by: z.string(), // User identifier
  received_at: z.coerce.date(),
  notes: z.string().nullable(),
  batch_id: z.string().nullable() // For grouping bulk receipts
});

export type Receipt = z.infer<typeof receiptSchema>;

// Input schema for creating items
export const createItemInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  category: z.string().min(1),
  unit_of_measure: z.string().min(1)
});

export type CreateItemInput = z.infer<typeof createItemInputSchema>;

// Input schema for single item submission
export const createSubmissionInputSchema = z.object({
  item_id: z.number(),
  quantity: z.number().positive(),
  submitted_by: z.string().min(1),
  notes: z.string().nullable()
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionInputSchema>;

// Input schema for bulk submissions
export const bulkSubmissionInputSchema = z.object({
  items: z.array(z.object({
    item_id: z.number(),
    quantity: z.number().positive(),
    notes: z.string().nullable()
  })).min(1),
  submitted_by: z.string().min(1),
  batch_notes: z.string().nullable()
});

export type BulkSubmissionInput = z.infer<typeof bulkSubmissionInputSchema>;

// Input schema for single item receipt
export const createReceiptInputSchema = z.object({
  item_id: z.number(),
  quantity: z.number().positive(),
  received_by: z.string().min(1),
  notes: z.string().nullable()
});

export type CreateReceiptInput = z.infer<typeof createReceiptInputSchema>;

// Input schema for bulk receipts
export const bulkReceiptInputSchema = z.object({
  items: z.array(z.object({
    item_id: z.number(),
    quantity: z.number().positive(),
    notes: z.string().nullable()
  })).min(1),
  received_by: z.string().min(1),
  batch_notes: z.string().nullable()
});

export type BulkReceiptInput = z.infer<typeof bulkReceiptInputSchema>;

// Schema for getting items with stock information
export const itemWithStockSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  category: z.string(),
  unit_of_measure: z.string(),
  total_submitted: z.number(),
  total_received: z.number(),
  current_stock: z.number(), // total_submitted - total_received
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ItemWithStock = z.infer<typeof itemWithStockSchema>;

// Schema for submission with item details
export const submissionWithItemSchema = z.object({
  id: z.number(),
  item_id: z.number(),
  item_name: z.string(),
  item_category: z.string(),
  unit_of_measure: z.string(),
  quantity: z.number(),
  submitted_by: z.string(),
  submitted_at: z.coerce.date(),
  notes: z.string().nullable(),
  batch_id: z.string().nullable()
});

export type SubmissionWithItem = z.infer<typeof submissionWithItemSchema>;

// Schema for receipt with item details
export const receiptWithItemSchema = z.object({
  id: z.number(),
  item_id: z.number(),
  item_name: z.string(),
  item_category: z.string(),
  unit_of_measure: z.string(),
  quantity: z.number(),
  received_by: z.string(),
  received_at: z.coerce.date(),
  notes: z.string().nullable(),
  batch_id: z.string().nullable()
});

export type ReceiptWithItem = z.infer<typeof receiptWithItemSchema>;