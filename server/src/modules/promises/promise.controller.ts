import { Request, Response, NextFunction } from 'express';
import { PromiseService } from './promise.service';
import { createPromiseSchema, updatePromiseSchema, fulfillPromiseSchema } from './promise.schema';

const promiseService = new PromiseService();

export class PromiseController {
  async getAllPromises(req: Request, res: Response, next: NextFunction) {
    try {
      const promises = await promiseService.getAllPromises();
      res.json(promises);
    } catch (error) {
      next(error);
    }
  }

  async getPromiseById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const promise = await promiseService.getPromiseById(id);

      if (!promise) {
        return res.status(404).json({ error: 'Promise not found' });
      }

      res.json(promise);
    } catch (error) {
      next(error);
    }
  }

  async createPromise(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createPromiseSchema.parse(req.body);
      const userId = req.user!.userId;

      const promise = await promiseService.createPromise(validatedData, userId);
      res.status(201).json(promise);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async updatePromise(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = updatePromiseSchema.parse(req.body);
      const userId = req.user!.userId;

      const promise = await promiseService.updatePromise(id, validatedData, userId);
      res.json(promise);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error.message === 'Conflict: Promise has been modified by another user') {
        return res.status(409).json({ error: error.message });
      }
      next(error);
    }
  }

  async fulfillPromise(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validatedData = fulfillPromiseSchema.parse(req.body);
      const userId = req.user!.userId;

      const promise = await promiseService.fulfillPromise(id, validatedData, userId);
      res.json(promise);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      if (error.message === 'Conflict: Promise has been modified by another user') {
        return res.status(409).json({ error: error.message });
      }
      next(error);
    }
  }

  async getOverduePromises(req: Request, res: Response, next: NextFunction) {
    try {
      const promises = await promiseService.getOverduePromises();
      res.json(promises);
    } catch (error) {
      next(error);
    }
  }

  async getDueTodayPromises(req: Request, res: Response, next: NextFunction) {
    try {
      const promises = await promiseService.getDueTodayPromises();
      res.json(promises);
    } catch (error) {
      next(error);
    }
  }
}
