import { Request, Response, NextFunction } from 'express';
import { AlertService } from './alert.service';

const alertService = new AlertService();

export class AlertController {
  async getAttentionItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await alertService.getAttentionItems();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await alertService.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      next(error);
    }
  }
}
