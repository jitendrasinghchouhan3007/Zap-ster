import slugify from "slugify";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";
import { Brand } from "../models/brand.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Order } from "../models/order.model.js";
import stripe from "stripe";
const stripeInstance = stripe(
  process.env.STRIPE_SECRET_KEY
);

export const getAllProducts = async (req, res) => {
  try {

    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(),
      Product.find()
        .select(
          "-description -inStock  -tags -reviews -createdAt -updatedAt"
        )
        .populate("category brand", "name image")
        .limit(limit)
        .skip(skip)
        .lean(),
    ]);

    const hasMore = skip + products.length < totalProducts;

    return res.status(200).json({
      success: true,
      message: products.length
        ? "Products fetched successfully"
        : "No more products",
      limit,
      skip,
      totalProducts,
      hasMore,
      products,
    });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

//GET Featured Products
export const getFeautredProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .select("name slug discountPrice images")
      .populate("category brand")
      .limit(14);

    if (products.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Products",
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSearchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    let query = {};

    if (keyword) {
      // Search in product name and description
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];

      // Search in category
      const category = await Category.findOne({
        name: { $regex: keyword, $options: "i" },
      });
      if (category) {
        query.$or.push({ category: category._id });
      }

      // Search in brand
      const brand = await Brand.findOne({
        name: { $regex: keyword, $options: "i" },
      });
      if (brand) {
        query.$or.push({ brand: brand._id });
      }
    }

    const products = await Product.find(query)
      .select(
        "-description -inStock -quantity -tags -reviews -createdAt -updatedAt"
      )
      .populate("category brand", "name");

    res.status(200).json({
      success: true,
      totalProducts:products.length,
      products
    });
  } catch (error) {
    console.error("Error in getSearchProducts:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate([
      { path: "category", select: "name slug image" },
      { path: "brand", select: "name slug image" },
      {
        path: "reviews.user",
        select: "fullname email profilePicture",
        model: "User",
      },
    ]);
    if (!product) {
      return res.status(401).send({ message: "No Product found " });
    }
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

//Products Find by Category
export const productsByCategory = async (req, res) => {
  try {
    const { rating, sort, discount } = req.query;

    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    let query = { category: category._id };

    if (rating) {
      query["ratings.averageRating"] = { $gte: Number(rating) };
    }
    if (discount) {
      query["discount"] = { $gte: Number(discount) };
    }

    let sortCriteria = {};
    if (sort === "priceLowToHigh") {
      sortCriteria.discountPrice = 1;
    } else if (sort === "priceHighToLow") {
      sortCriteria.discountPrice = -1;
    } else if (sort === "latest") {
      sortCriteria.createdAt = -1;
    }

    const products = await Product.find(query)
      .select(
        "-description -category -inStock -quantity -tags -reviews -createdAt -updatedAt"
      )
      .populate("category brand")
      .sort(sortCriteria);

    res.status(200).send({
      success: true,
      category: category.name,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error while getting products",
    });
  }
};

//Products Find by Brand
export const productsByBrand = async (req, res) => {
  try {
    const { keyword, rating, discount } = req.query;
    const brand = await Brand.findOne({ slug: req.params.slug });

    if (!brand) {
      return res.status(401).send({ message: "Brand not found" });
    }

    let query = { brand: brand._id };

    if (keyword) {
      const category = await Category.findOne({
        name: { $regex: keyword, $options: "i" },
      });
      query.$or = [
        { description: { $regex: keyword, $options: "i" } },
        { name: { $regex: keyword, $options: "i" } },
      ];
      if (category) {
        query.$or.push({ category: category._id });
      }
    }
    if (rating) {
      query["ratings.averageRating"] = { $gte: Number(rating) };
    }
    if (discount) {
      query["discount"] = { $gte: Number(discount) };
    }

    const products = await Product.find(query).populate("brand category");
    res.status(200).send({
      success: true,
      brand: brand.name,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//similar Products suggestions
export const similarProductsSuggestion = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Product.find({
      category: cid,
      _id: { $ne: pid },
    })
      .limit(10)
      .populate("category brand")
      .select("name slug discountPrice images");

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//Admin Access
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      originalPrice,
      discount,
      category,
      brand,
      quantity,
      tags,
    } = req.body;

    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (!description) {
      return res.status(401).send({ message: "Description is required" });
    }
    if (!originalPrice) {
      return res.status(401).send({ message: "Original Price  is required" });
    }
    if (!category) {
      return res.status(401).send({ message: "Category is required" });
    }
    if (!brand) {
      return res.status(401).send({ message: "Brand is required" });
    }
    if (!quantity) {
      return res.status(401).send({ message: "quantity is required" });
    }
    if (req.files && req.files.length > 4) {
      return res
        .status(400)
        .json({ message: "You can upload a maximum of 4 images" });
    }

    let tagsArray = Array.isArray(tags)
      ? tags
      : tags.split(",").map((tag) => tag.trim());

    const calculatedDiscountPrice = discount
      ? originalPrice - (originalPrice * discount) / 100
      : originalPrice;
    const stock = quantity > 0 ? true : false;

    // Handle image upload
    let images = [];
    if (req.files) {
      for (const file of req.files) {
        const localFilePath = file.path;
        const uploadedImage = await uploadOnCloudinary(localFilePath);
        if (uploadedImage) {
          images.push(uploadedImage.secure_url);
        }
      }
    }

    const categoryNameExists = await Category.findOne({
      slug: slugify(category),
    });
    if (!categoryNameExists) {
      return res.status(200).send({
        success: false,
        message: "Category Not Exisits",
      });
    }

    const brandNameExists = await Brand.findOne({ slug: slugify(brand) });
    if (!brandNameExists) {
      return res.status(200).send({
        success: false,
        message: "Brand Not Exisits",
      });
    }
    const newProduct = new Product({
      name,
      slug: slugify(name),
      description,
      originalPrice,
      discount,
      discountPrice: calculatedDiscountPrice,
      category: categoryNameExists,
      brand: brandNameExists,
      inStock: stock,
      quantity,
      images,
      tags: tagsArray,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      message: " Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error,
      message: "Error creating in product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }
    }
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update products 
export const updateProduct = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      name,
      description,
      originalPrice,
      discount,
      category,
      brand,
      quantity,
      tags,
    } = req.body;

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (originalPrice) product.originalPrice = originalPrice;
    if (discount !== undefined) {
      product.discount = discount;
      product.discountPrice = originalPrice ? originalPrice - (originalPrice * discount) / 100 : 0;
    }
    if (quantity !== undefined) {
      product.quantity = quantity;
      product.inStock = quantity > 0;
    }
    if (tags) {
      product.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());
    }

    // Update slug
    if (name) {
      product.slug = slugify(name);
    }

    // Update category
    if (category) {
      const categoryExists = await Category.findOne({ slug: slugify(category) });
      if (!categoryExists) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
      product.category = categoryExists._id;
    }

    // Update brand
    if (brand) {
      const brandExists = await Brand.findOne({ slug: slugify(brand) });
      if (!brandExists) {
        return res.status(404).json({ success: false, message: "Brand not found" });
      }
      product.brand = brandExists._id;
    }

    // Save updated product
    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};


//Wishlist
export const addProductTowishList = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wishlist.includes(productId)) {
      return res.status(409).json({ message: "Product already in wishlist" });
    }
    user.wishlist.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to wishlist successfully" });
  } catch (error) {
    console.error("Error adding product to wishlist:", error);
    res.status(500).json({
      message: "An error occurred while adding the product to wishlist",
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user and check if the product is in the wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.wishlist.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from the wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    res
      .status(200)
      .json({ message: "Product removed from wishlist successfully" });
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({
      message: "An error occurred while removing the product from wishlist",
    });
  }
};
export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.wishlist.length === 0) {
      return res.status(400).json({ message: "Wishlist is already empty" });
    }
    user.wishlist = [];
    await user.save();

    res
      .status(200)
      .json({ message: "All products removed from Wishlist successfully" });
  } catch (error) {
    console.error("Error clearing Wishlist:", error);
    res
      .status(500)
      .json({ message: "An error occurred while clearing the Wishlist" });
  }
};

//cart
export const addProductToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cartItems.includes(productId)) {
      return res.status(409).json({ message: "Product already in Cart" });
    }
    user.cartItems.push(productId);
    await user.save();

    res.status(200).json({ message: "Product added to Cart successfully" });
  } catch (error) {
    console.error("Error adding product to Cart:", error);
    res.status(500).json({
      message: "An error occurred while adding the product to Cart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user and check if the product is in the wishlist
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productIndex = user.cartItems.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in Cart" });
    }

    // Remove the product from the wishlist
    user.cartItems.splice(productIndex, 1);
    await user.save();

    res.status(200).json({ message: "Product removed from Cart successfully" });
  } catch (error) {
    console.error("Error removing product from Cart:", error);
    res.status(500).json({
      message: "An error occurred while removing the product from Cart",
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is already empty" });
    }
    user.cartItems = [];
    await user.save();

    res
      .status(200)
      .json({ message: "All products removed from Cart successfully" });
  } catch (error) {
    console.error("Error clearing Cart:", error);
    res
      .status(500)
      .json({ message: "An error occurred while clearing the Cart" });
  }
};

//order

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

    // Cash on Delivery
    if (paymentMethod === "Cash on Delivery") {
      const order = new Order({
        user: req.user._id,
        orderItems: orderItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod,
        paymentStatus: "Pending",
        itemsPrice,
        shippingPrice,
        totalPrice,
        orderStatus: "Processing",
      });

      const createdOrder = await order.save();

      // Update product quantities and user's orders
      await updateProductsAndUser(orderItems, req.user._id, createdOrder._id);

      return res.status(201).json({
        success: true,
        message: "Order created successfully with Cash on Delivery",
        order: createdOrder,
      });
    } else if (paymentMethod === "Online") {
      const lineItems = await Promise.all(
        orderItems.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error("Product not found");
          }

          return {
            price_data: {
              currency: "inr",
              product_data: {
                name: product.name,
                images: [product.images[0]],
              },
              unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
          };
        })
      );

      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        metadata: {
          orderItems: JSON.stringify(orderItems),
          shippingAddress: JSON.stringify(shippingAddress),
          itemsPrice: itemsPrice.toString(),
          shippingPrice: shippingPrice.toString(),
          totalPrice: totalPrice.toString(),
        },
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/confirm-order?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
      });

      return res.status(200).json({
        success: true,
        message: "Redirecting to Stripe...",
        sessionId: session.id,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment method" });
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

export const confirmOrder = async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripeInstance.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const orderItems = JSON.parse(session.metadata.orderItems);
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);
      const itemsPrice = parseFloat(session.metadata.itemsPrice);
      const shippingPrice = parseFloat(session.metadata.shippingPrice);
      const totalPrice = parseFloat(session.metadata.totalPrice);

      const order = new Order({
        user: req.user._id,
        orderItems: orderItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress,
        paymentMethod: "Online",
        paymentStatus: "Completed",
        itemsPrice,
        shippingPrice,
        totalPrice,
        orderStatus: "Processing",
      });

      const createdOrder = await order.save();

      // Update product quantities and user's orders
      await updateProductsAndUser(orderItems, req.user._id, createdOrder._id);

      return res.status(201).json({
        success: true,
        message: "Order created successfully after online payment",
        order: createdOrder,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Payment was not successful" });
    }
  } catch (error) {
    console.error("Error in confirmOrder:", error);
    return res.status(500).json({
      success: false,
      message: "Error confirming order",
      error: error.message,
    });
  }
};

async function updateProductsAndUser(orderItems, userId, orderId) {
  // Update product quantities
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      product.quantity = Math.max(0, product.quantity - item.quantity);
      product.inStock = product.quantity > 0;
      await product.save();
    }
  }
  await User.findByIdAndUpdate(userId, {
    $push: { myOrders: orderId },
  });
}
