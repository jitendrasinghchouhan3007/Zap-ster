import React from "react";
import { useNavigate } from "react-router-dom";


const ProductCardSecondary = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      className="pr-[1.1rem]  flex-shrink-0  "
      key={product._id}
    >
      <div className="text-center text-sm border dark:border-black  border-gray-300 shadow rounded-md overflow-hidden transition-transform transform  hover:scale-95 cursor-pointer ">
        <div className="w-[8rem] md:w-[12.5rem] h-[8rem] md:h-[12.5rem] flex items-center justify-center p-3 bg-gray-50 overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.slug}
            className="max-h-full max-w-full object-contain mix-blend-multiply"
          />
        </div>
        <span className="text-C ">{product.brand.name} </span>
        <h3 className="text-black font-serif dark:text-white">
          {product.name}
        </h3>
        <p className="pb-2">
          <span className="font-semibold dark:text-white">
            ₹{product.discountPrice.toLocaleString("en-IN")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProductCardSecondary;
