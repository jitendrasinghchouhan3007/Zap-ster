import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { requireLogIn, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  productsByCategory,
  productsByBrand,
  similarProductsSuggestion,
  getFeautredProducts,
  addProductTowishList,
  removeFromWishlist,
  clearWishlist,
  addProductToCart,
  removeFromCart,
  clearCart ,
  createOrder,
 confirmOrder,
 getSearchProducts,
 updateProduct
} from "../controllers/product.controller.js";

const router = express.Router();

//Public
router.get("/all-products", getAllProducts);
router.get("/featured-products", getFeautredProducts);
router.get("/:slug", getSingleProduct);
//Products Find by Category
router.get("/productsByCategory/:slug", productsByCategory);
//Products Find by Brand
router.get("/productsByBrand/:slug", productsByBrand);
//similar Products suggestions
router.get("/similar-product/:pid/:cid", similarProductsSuggestion);
// search Products by keyword
router.get("/search/:keyword", getSearchProducts);

//Wishlist
router.put("/addtowishlist/:productId", requireLogIn, addProductTowishList);
router.put("/removetowishlist/:productId", requireLogIn, removeFromWishlist);
router.put("/clear-wishlist", requireLogIn, clearWishlist);



//Cart
router.put("/addtocart/:productId", requireLogIn, addProductToCart);
router.put("/removetocart/:productId", requireLogIn, removeFromCart);
router.put("/clear-cart", requireLogIn, clearCart);


//order 
router.post("/create-order",requireLogIn,createOrder);
router.post('/confirm-order',requireLogIn,confirmOrder);



//Admin Access
router.post(
  "/create-product",
  requireLogIn,
  requireAdmin,
  upload.array("images"),
  createProduct
);
router.delete("/delete/:productId",  requireLogIn, requireAdmin,upload.array("images"), deleteProduct);

router.put(
  "/update-product/:slug",
  requireLogIn,
  requireAdmin,
  updateProduct
);

export default router;
