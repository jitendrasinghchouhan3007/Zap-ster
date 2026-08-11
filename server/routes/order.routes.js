import express from "express";
import { getAllOrders, updateOrder } from "../controllers/order.controller.js";
import { requireLogIn, requireAdmin } from "../middlewares/auth.middleware.js"; 

const router = express.Router();

router.get("/all-orders", requireLogIn, requireAdmin, getAllOrders);
router.put("/update-order/:id", requireLogIn, requireAdmin, updateOrder);

export default router;
