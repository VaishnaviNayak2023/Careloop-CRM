import { Router } from 'express';
import { AlertController } from './alert.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();
const alertController = new AlertController();

// All alert routes require authentication
router.use(authenticate);

router.get('/attention', alertController.getAttentionItems.bind(alertController));
router.get('/metrics', alertController.getDashboardMetrics.bind(alertController));

export default router;
