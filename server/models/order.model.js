import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          default:1
        },
        price: {
          type: Number,
          required: true,
        },
      }
    ],
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Online', 'Cash on Delivery'],
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    deliveredAt: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      },
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);