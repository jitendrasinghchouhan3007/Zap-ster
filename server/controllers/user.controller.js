import { User } from "../models/user.model.js";
import { Order} from "../models/order.model.js"
import { Product } from "../models/product.model.js"; 
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { generateHash, compareHash } from "../utils/generateHash.js";
import dotenv from "dotenv";
import JWT from "jsonwebtoken";

dotenv.config();

export const createUser = async (req, res) => {
  try {
    const { fullname, email, mobile, securityAnswer, password } = req.body;

    // Validate required fields
    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!fullname)
      return res.status(400).json({ error: "Full-name is required" });
    if (!password)
      return res.status(400).json({ error: "Password is required" });
    if (!mobile)
      return res.status(400).json({ error: "mobile number is required" });
    if (!securityAnswer)
      return res.status(400).json({ error: "security answer is required" });

    // Check if the user already exists
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }

    // Handle file uploads
    let profilePictureUrl = "";

    if (req.file) {
      const profilePictureLocalPath = req.file.path;
      const profilePic = await uploadOnCloudinary(profilePictureLocalPath);

      if (profilePic) {
        profilePictureUrl = profilePic.secure_url;
      }
    }

    // Converting password into hashed password
    const hashedPassword = await generateHash(password);

    const user = await User.create({
      email,
      fullname,
      password: hashedPassword,
      profilePicture: profilePictureUrl,
      mobile,
      securityAnswer,
    });

    // Send response
    res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({
        success: false,
        message: " Email is required",
      });
    }

    // Find the user by username or email
    const user = await User.findOne({ email }).select(
      "_id fullname email profilePicture mobile role password"
    );

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User does not exist",
      });
    }

    // Validate password
    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = await JWT.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send response
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    if (!email || !securityAnswer || !newPassword) {
      res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ email, securityAnswer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    const hashednewPassword = await generateHash(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashednewPassword });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const updateProfilePic = async (req, res) => {
  try {
    const profilePictureLocalPath = req.file?.path;

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If no new profile picture is provided, return the user object without making any changes
    if (!profilePictureLocalPath) {
      return res.status(200).json({
        success: true,
        message: "No new profile picture provided, existing picture retained",
        user: user,
      });
    }

    // Upload new profile picture to Cloudinary
    const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

    if (!profilePicture.url) {
      return res.status(400).json({
        success: false,
        message: "Error while uploading profile picture",
      });
    }

    // Delete old image if it exists
    if (user.profilePicture) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Update user's profile picture URL in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profilePicture: profilePicture.url,
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Successfully updated profile picture",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating profile picture",
      error: error.message || error,
    });
  }
};

export const deleteProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Delete old image if it exists
    if (user.profilePicture) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Update user's avatar to an empty string in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          profilePicture: "",
        },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Successfully removed profilePicture",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting profilePicture",
      error: error.message || error,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete user's reviews from all products
    await Product.updateMany(
      { "reviews.user": userId },
      { $pull: { reviews: { user: userId } } }
    );

    // Update average rating and number of reviews for each affected product
    const productsWithUserReviews = await Product.find({ "reviews.user": userId });
    for (const product of productsWithUserReviews) {
      const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      const numberOfReviews = product.reviews.length;
      product.ratings.averageRating = numberOfReviews ? totalRatings / numberOfReviews : 0;
      product.ratings.numberOfReviews = numberOfReviews;
      await product.save();
    }

    // Delete profile picture from Cloudinary if present
    if (user.profilePicture) {
      const publicId = user.profilePicture.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Delete user from the database
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const updateProfileInfo = async (req, res) => {
  try {
    const { fullname, mobile, email, password } = req.body;
    const userId = req.user._id;

    // Find the existing user
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password length if provided
    if (password && password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // Check if email is already in use
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email: email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    // Hash the new password if it is provided
    let hashedPassword;
    if (password) {
      hashedPassword = await generateHash(password);
    }

    // Construct the update object
    const updates = {};
    if (fullname) updates.fullname = fullname;
    if (password) updates.password = hashedPassword;
    if (email) updates.email = email;
    if (mobile) updates.mobile = mobile;

    // Update the user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }
    ).select(
      "_id fullname email profilePicture mobile role password"
    );

    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error while updating profile",
      error: error.message || error,
    });
  }
};

export const getAllWishlistProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'wishlist',
      select: "-description -category -inStock -quantity -tags -reviews -createdAt -updatedAt ",
      populate: "brand"
    })
    

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      products: user.wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAllCartProducts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
      path: 'cartItems',
      select: "-description -category -inStock -tags -reviews  -updatedAt ",
      populate: "brand"
    })

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      products: user.cartItems
    });
  } catch (error) {
    console.error('Error fetching cart products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCheckoutInfo = async (req,res)=> {

  const userId = req.user._id;

  const user = await User.findById(userId).populate(["addresses",{
    path: 'cartItems',
    select: "-description -category -inStock -tags -reviews  -updatedAt ",
    populate: "brand"
  }])

  if (!user) {
      return res.status(404).json({ message: 'User not found' });
  }
 
  res.json({
    addresses: user.addresses,
    cartItems: user.cartItems
  });

}

export const getAllOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .select('-user') 
      .populate({
        path: 'orderItems.product',
        select: 'name slug discountPrice originalPrice images', 
      })
      .lean(); 

    if (!orders.length) {
      return res.status(200).send({ success: false, message: 'No orders found',orders:[] });
    }

    res.status(200).json({
      success: true,
      myOrders: orders,
    });
  } catch (error) {
    console.error('Error fetching Orders:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


//Admin Access controllers

export const allUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const users = await User.find()
      .limit(limit)
      .skip(skip)
      .select(["email", "fullname", "profilePicture","mobile"]);

    const totalUsers = await User.countDocuments();

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No More users found",
        limit,
        skip,
        total: totalUsers,
        data: users,
      });
    }

    res.status(200).json({
      success: true,
      message: "all users fetched",
      total: totalUsers,
      limit,
      skip,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
