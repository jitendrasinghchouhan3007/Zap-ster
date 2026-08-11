import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { requireLogIn, requireAdmin } from "../middlewares/auth.middleware.js";
import { createBrand,updateBrand,deleteBrand,allBrands,getSingleBrand } from "../controllers/brand.controller.js";

const router = express.Router();


router.get("/all-brands", allBrands);
router.get("/:slug", getSingleBrand);

//Admin Access
router.post("/create-brand", requireLogIn, requireAdmin,upload.single("image"), createBrand);
router.put("/update-brand/:id", requireLogIn, requireAdmin, updateBrand);
router.delete("/delete-brand/:id", requireLogIn, requireAdmin, deleteBrand);

export default router;
