import { Router } from 'express';
import { WooCommerceController } from './woocommerce.controller';
import { authenticate, requireRole } from '../../../middleware/auth';

const router = Router();
const wooCommerceController = new WooCommerceController();

// All WooCommerce routes require authentication and manager role
router.use(authenticate);
router.use(requireRole('MANAGER'));

router.post('/connect', wooCommerceController.connect.bind(wooCommerceController));
router.post('/test-connection', wooCommerceController.testConnection.bind(wooCommerceController));
router.get('/:id/status', wooCommerceController.getStatus.bind(wooCommerceController));
router.post('/sync', wooCommerceController.sync.bind(wooCommerceController));
router.post('/:id/disconnect', wooCommerceController.disconnect.bind(wooCommerceController));
router.post('/demo-mode', wooCommerceController.enableDemoMode.bind(wooCommerceController));

export default router;
