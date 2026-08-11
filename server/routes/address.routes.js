import express from "express";
import { requireLogIn } from "../middlewares/auth.middleware.js";
import {
  createAddress,
  getUserAddresses,
  deleteAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/:userId/create-address", requireLogIn, createAddress);
router.get("/all-address/:userId", requireLogIn, getUserAddresses);
router.delete("/delete-address/:addressId", requireLogIn, deleteAddress);

export default router;
