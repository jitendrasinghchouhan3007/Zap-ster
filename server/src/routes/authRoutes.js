import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { getOrders } from '../controllers/orderController.js';
import { getCart, getWishlist } from '../controllers/productController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-user', register);

router.post('/login', login);
router.post('/login-user', login);

router.get('/me', verifyToken, getProfile);
router.get('/myOrders', verifyToken, getOrders);
router.get('/cart', verifyToken, getCart);
router.get('/wishlist', verifyToken, getWishlist);

export default router;
