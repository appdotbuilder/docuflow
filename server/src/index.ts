import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createItemInputSchema,
  createSubmissionInputSchema,
  bulkSubmissionInputSchema,
  createReceiptInputSchema,
  bulkReceiptInputSchema
} from './schema';

// Import handlers
import { createItem } from './handlers/create_item';
import { getItems } from './handlers/get_items';
import { getItemById } from './handlers/get_item_by_id';
import { createSubmission } from './handlers/create_submission';
import { createBulkSubmission } from './handlers/create_bulk_submission';
import { createReceipt } from './handlers/create_receipt';
import { createBulkReceipt } from './handlers/create_bulk_receipt';
import { getSubmissions } from './handlers/get_submissions';
import { getReceipts } from './handlers/get_receipts';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Item management routes
  createItem: publicProcedure
    .input(createItemInputSchema)
    .mutation(({ input }) => createItem(input)),
  
  getItems: publicProcedure
    .query(() => getItems()),

  getItemById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => getItemById(input.id)),

  // Submission routes
  createSubmission: publicProcedure
    .input(createSubmissionInputSchema)
    .mutation(({ input }) => createSubmission(input)),

  createBulkSubmission: publicProcedure
    .input(bulkSubmissionInputSchema)
    .mutation(({ input }) => createBulkSubmission(input)),

  getSubmissions: publicProcedure
    .query(() => getSubmissions()),

  // Receipt routes
  createReceipt: publicProcedure
    .input(createReceiptInputSchema)
    .mutation(({ input }) => createReceipt(input)),

  createBulkReceipt: publicProcedure
    .input(bulkReceiptInputSchema)
    .mutation(({ input }) => createBulkReceipt(input)),

  getReceipts: publicProcedure
    .query(() => getReceipts()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();