import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Brand name cannot exceed 50 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
     image: {
      type: String,
      required: [true, "Image is required"],
      default: "",
    }
  },
  { timestamps: false}
);

export const Brand = mongoose.model("Brand", brandSchema);
