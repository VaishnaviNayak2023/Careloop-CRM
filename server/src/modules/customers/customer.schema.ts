import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  customerType: z.string().default('individual'),
  status: z.string().default('active'),
  source: z.string().default('direct'),
  tags: z.string().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial().extend({
  version: z.number().min(1),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
