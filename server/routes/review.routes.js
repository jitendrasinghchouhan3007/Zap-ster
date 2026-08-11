import express from "express";
import {requireLogIn} from "../middlewares/auth.middleware.js";
import { addReview } from "../controllers/review.controller.js";


const router = express.Router();

router.post('/:productId',requireLogIn,addReview);


export default router;