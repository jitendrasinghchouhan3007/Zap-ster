import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxlength: [100, "Name should not exceed 100 characters"],
    },
    locality: {
      type: String,
      required: true,
      trim: true,
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    addressType: {
      type: String,
      required: true,
      enum: ['Home', 'Work'],
    },
  },
  { timestamps: false }
);

export const Address = mongoose.model("Address", addressSchema);
