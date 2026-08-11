import Stripe from "stripe";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order items" });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Handle Cash on Delivery (COD) case
    if (paymentMethod === "Cash on Delivery") {
      const createdOrder = await order.save();
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.quantity = Math.max(0, product.quantity - item.quantity);
          product.inStock = product.quantity > 0;
          await product.save();
        }
      }
      await User.findByIdAndUpdate(req.user._id, {
        wishlist: [],
        $push: { myOrders: createdOrder._id },
      });
      return res.status(201).json({
        success: true,
        message: "Order placed successfully with Cash on Delivery",
        order: createdOrder,
      });
    }

    // Handle Online Payment (Stripe)
    if (paymentMethod === "Online") {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalPrice * 100,
        currency: "inr",
        payment_method_types: ["card"],
        metadata: {
          orderId: order._id.toString(),
          userId: req.user._id.toString(),
        },
      });
      return res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
        message: "Payment intent created successfully",
      });
    }
  } catch (error) {
    console.error("Error in createOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "fullname email profilePicture")
    .populate("orderItems.product", "name images")
    .sort({ createdAt: -1 });
  res.json(orders);
};


// Update Order Controller
export const updateOrder = async (req, res) => {
  const { id } = req.params; 
  const { paymentStatus, orderStatus } = req.body; 

  try {
    // Find the order by ID
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update the fields if provided
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;

    // Save the updated order
    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};
