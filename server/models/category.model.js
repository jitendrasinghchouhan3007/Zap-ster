import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      default: "",
    },
  },
  { timestamps: false }
);

export const Category = mongoose.model("Category", categorySchema);
