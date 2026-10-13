import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';
import { createCustomerSchema, updateCustomerSchema } from './customer.schema';

const customerService = new CustomerService();

export class CustomerController {
  async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await customerService.getAllCustomers();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json(customer);
    } catch (error) {
      next(error);
    }
  }

  async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createCustomerSchema.parse(req.body);
      const userId = req.user!.userId;

      const customer = await customerService.createCustomer(validatedData, userId);
      res.status(201).json(customer);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updateCustomerSchema.parse(req.body);
      const userId = req.user!.userId;

      const customer = await customerService.updateCustomer(id, validatedData, userId);
      res.json(customer);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error.message === 'Conflict: Customer has been modified by another user') {
        return res.status(409).json({ error: error.message });
      }
      next(error);
    }
  }

  async getCustomerTimeline(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const timeline = await customerService.getCustomerTimeline(id);
      res.json(timeline);
    } catch (error) {
      next(error);
    }
  }
}
