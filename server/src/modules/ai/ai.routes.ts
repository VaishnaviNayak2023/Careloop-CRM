import { Router } from 'express';
import { AIController } from './ai.controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const aiController = new AIController();

// All AI routes require authentication and staff/manager role
router.use(authenticate);
router.use(requireRole('MANAGER', 'STAFF_ADMIN'));

router.post('/reply-draft', aiController.generateReplyDraft.bind(aiController));

export default router;
