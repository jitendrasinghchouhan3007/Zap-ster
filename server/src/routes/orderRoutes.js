import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);
router.post('/create-order', verifyToken, createOrder);

router.get('/', verifyToken, getOrders);
router.get('/all-orders', verifyToken, getOrders);
router.get('/user-orders', verifyToken, getOrders);
router.get('/:id', verifyToken, getOrderById);

router.patch('/:id/cancel', verifyToken, cancelOrder);
router.put('/update-order/:id', verifyToken, (req, res) => {
  // If request cancels order or updates status to CANCELLED
  if (req.body?.orderStatus === 'Cancelled' || req.body?.orderStatus === 'CANCELLED') {
    return cancelOrder(req, res);
  }
  return cancelOrder(req, res);
});

export default router;
