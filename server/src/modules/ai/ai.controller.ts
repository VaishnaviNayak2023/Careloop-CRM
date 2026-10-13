import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { z } from 'zod';

const aiService = new AIService();

const replyDraftSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  promiseId: z.string().optional(),
  supportRequestId: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'apologetic', 'concise']).default('professional'),
});

export class AIController {
  async generateReplyDraft(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = replyDraftSchema.parse(req.body);
      const result = await aiService.generateReplyDraft(validatedData);
      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }
}
