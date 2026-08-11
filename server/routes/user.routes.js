import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { requireLogIn, requireAdmin } from "../middlewares/auth.middleware.js";
import {
  createUser,
  login,
  forgotPassword,
  allUsers,
  updateProfilePic,
  deleteProfilePic,
  getSingleUser,
  deleteUser,
  updateProfileInfo,
  getAllWishlistProducts,
  getAllCartProducts,
  getCheckoutInfo,
  getAllOrders
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", upload.single("profilePicture"), createUser);

router.post("/login", login);

router.put("/forgot-password", forgotPassword);

router.put("/update-profile-info", requireLogIn,updateProfileInfo );


router.put(
  "/updateProfilePic",
  upload.single("profilePicture"),
  requireLogIn,
  updateProfilePic
);

router.delete("/deleteProfilePic", requireLogIn, deleteProfilePic);

router.delete("/deleteUserPermanently", requireLogIn, deleteUser);



router.get("/wishlist",requireLogIn, getAllWishlistProducts);

router.get("/cart",requireLogIn, getAllCartProducts);


router.get("/checkout",requireLogIn, getCheckoutInfo);

router.get("/myOrders",requireLogIn, getAllOrders);



//Admin Access

router.get("/all-users", requireLogIn, requireAdmin, allUsers);

//not in use {implement pending}
router.get("/user/:id", requireLogIn, requireAdmin, getSingleUser);

export default router;
