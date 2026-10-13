import { Router } from 'express';
import { PromiseController } from './promise.controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const promiseController = new PromiseController();

// All promise routes require authentication
router.use(authenticate);

router.get('/', promiseController.getAllPromises.bind(promiseController));
router.get('/overdue', promiseController.getOverduePromises.bind(promiseController));
router.get('/due-today', promiseController.getDueTodayPromises.bind(promiseController));
router.get('/:id', promiseController.getPromiseById.bind(promiseController));
router.post('/', requireRole('MANAGER', 'STAFF_ADMIN'), promiseController.createPromise.bind(promiseController));
router.patch('/:id', requireRole('MANAGER', 'STAFF_ADMIN'), promiseController.updatePromise.bind(promiseController));
router.post('/:id/fulfill', requireRole('MANAGER', 'STAFF_ADMIN'), promiseController.fulfillPromise.bind(promiseController));

export default router;
