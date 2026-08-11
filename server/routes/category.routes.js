import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { requireLogIn, requireAdmin } from "../middlewares/auth.middleware.js";
import { createCategory,updateCategory,deleteCategory,allCategories,getSingleCategory } from "../controllers/category.controller.js";

const router = express.Router();


router.get("/all-categories", allCategories);
router.get("/:slug", getSingleCategory);

//Admin Access
router.post("/create-category",upload.single("image"), requireLogIn, requireAdmin, createCategory);
router.put("/update-category/:id",requireLogIn, requireAdmin, updateCategory);
router.delete("/delete-category/:id", requireLogIn, requireAdmin, deleteCategory);

export default router;
