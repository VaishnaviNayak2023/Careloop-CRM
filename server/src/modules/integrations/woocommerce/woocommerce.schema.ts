import { z } from 'zod';

export const connectIntegrationSchema = z.object({
  storeUrl: z.string().url('Invalid store URL'),
  consumerKey: z.string().min(1, 'Consumer key is required'),
  consumerSecret: z.string().min(1, 'Consumer secret is required'),
  importCustomers: z.boolean().default(true),
  importOrders: z.boolean().default(true),
  importProducts: z.boolean().default(false),
});

export const syncRequestSchema = z.object({
  integrationId: z.string().min(1, 'Integration ID is required'),
  type: z.enum(['full', 'customers', 'orders']).default('full'),
});

export type ConnectIntegrationInput = z.infer<typeof connectIntegrationSchema>;
export type SyncRequestInput = z.infer<typeof syncRequestSchema>;
