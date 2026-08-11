import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      maxlength: [100, "Product name should not exceed 100 characters"],
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Product original price is required"],
      min: [0, "Product original price cannot be less than 0"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be less than 0"],
      max: [100, "Discount cannot exceed 100%"],
    },
    discountPrice: {
      type: Number,
      required: [true, "Product discount price is required"],
      min: [0, "Product discount price cannot be less than 0"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Product brand is required"],
    },
    inStock: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      required: [true, "Product Qunatity is required"],
      min: [0, "Qunatity cannot be less than 0"],
    },
    images: [
      {
        type: String,
      },
    ],
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: [0, "Rating cannot be less than 0"],
        max: [5, "Rating cannot exceed 5"],
      },
      numberOfReviews: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: [0, "Rating cannot be less than 0"],
          max: [5, "Rating cannot exceed 5"],
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
