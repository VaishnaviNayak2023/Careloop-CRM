import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { authenticate, requireRole } from '../../middleware/auth';

const router = Router();
const customerController = new CustomerController();

// All customer routes require authentication
router.use(authenticate);

router.get('/', customerController.getAllCustomers.bind(customerController));
router.get('/:id', customerController.getCustomerById.bind(customerController));
router.post('/', requireRole('MANAGER', 'STAFF_ADMIN'), customerController.createCustomer.bind(customerController));
router.patch('/:id', requireRole('MANAGER', 'STAFF_ADMIN'), customerController.updateCustomer.bind(customerController));
router.get('/:id/timeline', customerController.getCustomerTimeline.bind(customerController));

export default router;
