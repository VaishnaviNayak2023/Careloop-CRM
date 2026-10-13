import { Request, Response, NextFunction } from 'express';
import { WooCommerceService } from './woocommerce.service';
import { connectIntegrationSchema, syncRequestSchema } from './woocommerce.schema';

const wooCommerceService = new WooCommerceService();

export class WooCommerceController {
  async connect(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = connectIntegrationSchema.parse(req.body);
      const userId = req.user!.userId;

      const integration = await wooCommerceService.connectIntegration(validatedData, userId);
      res.status(201).json(integration);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const status = await wooCommerceService.getIntegrationStatus(id);
      res.json(status);
    } catch (error) {
      next(error);
    }
  }

  async sync(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = syncRequestSchema.parse(req.body);
      const { integrationId, type } = validatedData;

      let result;
      if (type === 'customers' || type === 'full') {
        result = await wooCommerceService.syncCustomers(integrationId);
      }
      if (type === 'orders' || type === 'full') {
        result = await wooCommerceService.syncOrders(integrationId);
      }

      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async disconnect(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const integration = await wooCommerceService.disconnectIntegration(id);
      res.json(integration);
    } catch (error) {
      next(error);
    }
  }
}
