import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { loginSchema, signupSchema } from './auth.schema';

const authService = new AuthService();

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = signupSchema.parse(req.body);

      // For demo purposes, allow manager signup if the code is "DEMO_MANAGER"
      // In production, this should be strictly controlled
      if (validatedData.role === 'MANAGER' && req.body.inviteCode !== 'DEMO_MANAGER') {
        return res.status(403).json({ error: 'Invalid invite code for manager role' });
      }

      const result = await authService.signup(validatedData);
      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await authService.login(validatedData);
      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getMe(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
