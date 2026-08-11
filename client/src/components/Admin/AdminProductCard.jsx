import React from "react";
import { FaImage, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminProductCard = ({
  product,
  index,
  handleDelete,
  isOpen,
  setISOpen,
  setSlug
}) => {
const navigate = useNavigate();
const handleclick=()=>{
  setISOpen(!isOpen);
  setSlug()
}  
  
  return (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden text-sm  ">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className=" font-semibold text-gray-800">
            {index + 1}. {product.brand.name} {product.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              product.quantity > 100
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            Stock: {product.quantity}
          </span>
        </div>
        <div className="flex items-center  justify-between ">
          <div onClick={()=>navigate(`/product/${product.slug}`)} className="min-w-24 h-24 rounded-md overflow-hidden  flex items-center justify-center  cursor-pointer">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.slug}
                className="w-full h-full object-cover ml-5"
              />
            ) : (
              <FaImage className="w-12 h-12 text-gray-300" />
            )}
          </div>
          <div className="">
            <div className="flex space-x-2">
              <button
                onClick={handleclick}
                className="px-3 py-1 flex items-center shadow rounded-full bg-gray-100 hover:shadow-lg"
              >
                <FaEdit className="mr-1" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 flex items-center"
              >
                <FaTrash className="mr-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductCard;
