import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addToCart,
  removeFromCart,
  clearCart,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getSimilarProducts
} from '../controllers/productController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/all-products', getProducts);
router.get('/search/:keyword', (req, res) => {
  req.query.search = req.params.keyword;
  getProducts(req, res);
});
router.get('/similar-product/:pid/:cid', getSimilarProducts);
router.get('/:id', getProductById);

router.post('/', verifyToken, requireAdmin, createProduct);
router.post('/create', verifyToken, requireAdmin, createProduct);

router.put('/addtocart/:productId', verifyToken, addToCart);
router.put('/removetocart/:productId', verifyToken, removeFromCart);
router.put('/clear-cart', verifyToken, clearCart);

router.put('/addtowishlist/:productId', verifyToken, addToWishlist);
router.put('/removetowishlist/:productId', verifyToken, removeFromWishlist);
router.put('/clear-wishlist', verifyToken, clearWishlist);

router.put('/:id', verifyToken, requireAdmin, updateProduct);
router.put('/update/:id', verifyToken, requireAdmin, updateProduct);

router.delete('/:id', verifyToken, requireAdmin, deleteProduct);
router.delete('/delete/:id', verifyToken, requireAdmin, deleteProduct);

export default router;
