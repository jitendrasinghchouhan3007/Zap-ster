import slugify from "slugify";
import { Category } from "../models/category.model.js";
import {Product} from "../models/product.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

export const allCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find({}).skip(skip).limit(limit);
    const total = await Category.countDocuments();
    res.status(200).send({
      success: true,
      message: "All Categories List",
      totalCategories: total,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all categories",
    });
  }
};

export const getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(200).send({
        success: false,
        message: "Category not Exisits",
      });
    }
    res.status(200).send({
      success: true,
      message: "fetch successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

//Admin Access
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Name is required" });
    }

    if (!req.file) {
      return res.status(400).send({ message: "Image is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    // Handle file upload
    const imageLocalPath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);

    if (!cloudinaryResponse) {
      return res.status(500).send({
        success: false,
        message: "Error uploading image to Cloudinary",
      });
    }

    const imageUrl = cloudinaryResponse.secure_url;

    const category = await new Category({
      name,
      slug: slugify(name),
      image: imageUrl,
    }).save();

    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error creating category",
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check for duplicate name (excluding the current category)
    if (name) {
      const existingCategoryWithName = await Category.findOne({
        name,
        _id: { $ne: id },
      });
      if (existingCategoryWithName) {
        return res.status(400).json({
          success: false,
          message: "Category name already exists",
        });
      }
    }

    // Fetch the category to be updated
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};


export const deleteCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Find the category first
    const deletedCategory = await Category.findById(id);

    if (!deletedCategory) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete Image from Cloudinary
    if (deletedCategory.image) {
      const publicId = deletedCategory.image.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Delete all products associated with this category
    const deletedProducts = await Product.find({ category: id });
    
    // Delete products with their images from Cloudinary
    for (const product of deletedProducts) {
      // Delete product images from Cloudinary
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          await deleteFromCloudinary(publicId);
        }
      }
    }

    // Delete products from database
    await Product.deleteMany({ category: id });

    // Delete category from database
    await Category.findByIdAndDelete(id);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Category and related products deleted successfully",
      category: deletedCategory,
      deletedProductsCount: deletedProducts.length
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
