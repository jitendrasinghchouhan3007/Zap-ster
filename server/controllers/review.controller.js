import { Product } from "../models/product.model.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    
    if (!rating) {
      return res.status(401).send({ message: "Rating is required" });
    }
    if (!comment) {
      return res.status(401).send({ message: "Comment is required" });
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "Product already reviewed by you " });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.ratings.numberOfReviews = product.reviews.length;

    product.ratings.averageRating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

