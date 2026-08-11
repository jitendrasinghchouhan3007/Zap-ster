import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import {User} from "../models/user.model.js";

dotenv.config();

export const requireLogIn = async (req, res, next) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!req.headers.authorization) {
      return res.status(401).send("No token provided");
    }

    const decodedToken = JWT.verify(req.headers.authorization, JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Invalid token");
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "ADMIN") {
      return res.status(401).send({
        success: false,
        message: "Access forbidden",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Unauthorized Access",
    });
  }
};
