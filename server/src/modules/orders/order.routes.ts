import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const orderController = new OrderController();

// All order routes require authentication
router.use(authenticate);

router.get('/', orderController.getAllOrders.bind(orderController));
router.get('/:id', orderController.getOrderById.bind(orderController));
router.get('/customer/:customerId', orderController.getOrdersByCustomer.bind(orderController));
router.post('/:id/promises', requireRole('MANAGER', 'STAFF_ADMIN'), orderController.createPromiseFromOrder.bind(orderController));

export default router;
