import { z } from 'zod';

export const createPromiseSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueAt: z.string().datetime('Invalid date format'),
  priority: z.string().default('medium'),
  assignedTo: z.string().min(1, 'Assignee is required'),
});

export const updatePromiseSchema = createPromiseSchema.partial().extend({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED']).optional(),
  version: z.number().min(1),
});

export const fulfillPromiseSchema = z.object({
  version: z.number().min(1),
});

export type CreatePromiseInput = z.infer<typeof createPromiseSchema>;
export type UpdatePromiseInput = z.infer<typeof updatePromiseSchema>;
export type FulfillPromiseInput = z.infer<typeof fulfillPromiseSchema>;
