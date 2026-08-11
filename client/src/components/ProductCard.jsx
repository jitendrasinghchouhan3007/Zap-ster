import React from 'react';
import renderRatingStars from "../components/RenderRatingStars";
import { useNavigate } from "react-router-dom";

const ProductCard = ({product}) => {

  const navigate = useNavigate();


    const formatPrice = (price) => {
        return price.toLocaleString("en-IN");
      };


  return (
    <div
    onClick={() => navigate(`../product/${product.slug}`)}
    key={product._id}
    className="relative text-sm border bg-white border-gray-300 shadow rounded-md overflow-hidden transition-transform transform hover:scale-95 cursor-pointer"
  >
    <p className="absolute top-2 left-2 font-semibold text-red-600">
      {product.discount}% OFF
    </p>
    <div className="w-full h-48 sm:h-52 md:h-56 flex items-center justify-center p-3 overflow-hidden bg-gray-50">
      <img
        src={product.images[0]}
        alt={product.slug}
        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
      />
    </div>
    <div className="flex justify-center items-center mb-2">
      {renderRatingStars(product.ratings.averageRating)}
      <span className="text-gray-500">
        ({product.ratings.averageRating})
      </span>
    </div>
    <p className="text-center md:text-[16px] p-1">
      <span className="text-C">{product.brand.name} </span>
      <span className="text-black font-serif">{product.name}</span>
    </p>
    <p className="px-4 p-2 text-center">
      <sub className="line-through text-gray-500 mr-2 text-[13px]">
        ₹{formatPrice(product.originalPrice)}
      </sub>
      <span className="font-semibold text-green-600">
        ₹{formatPrice(product.discountPrice)}
      </span>
    </p>
  </div>
  )
}

export default ProductCard
