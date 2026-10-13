import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { z } from 'zod';

const orderService = new OrderService();

const createPromiseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  dueAt: z.string().datetime('Invalid date format'),
  priority: z.string().default('medium'),
  assignedTo: z.string().optional(),
});

export class OrderController {
  async getAllOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getOrdersByCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerId } = req.params;
      const orders = await orderService.getOrdersByCustomer(customerId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async createPromiseFromOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = createPromiseSchema.parse(req.body);
      const userId = req.user!.userId;

      const promise = await orderService.createPromiseFromOrder(id, validatedData, userId);
      res.status(201).json(promise);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }
}
