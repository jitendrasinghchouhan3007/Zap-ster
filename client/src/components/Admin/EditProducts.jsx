import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiSave } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";

const EditProducts = ({ slug, isOpen, setIsOpen,refetch  }) => {
  const [auth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discount: "",
    category: "",
    brand: "",
    quantity: "",
    tags: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/product/${slug}`);
        if (data.product || data.success) {
          const product = data.product || data;
          setFormData({
            name: product.name || "",
            description: product.description || "",
            originalPrice: product.originalPrice || "",
            discount: product.discount || "",
            category: product.category?.name || "",
            brand: product.brand?.name || "",
            quantity: product.quantity || "",
            tags: product.tags?.join(", ") || "",
          });
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/update-product/${slug}`,
        formData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (data.success) {
        toast.success("Product updated successfully");
        refetch();
        setIsOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <AiOutlineLoading3Quarters className="text-4xl animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-5 bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-700">Edit Product</h1>
        <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
          <MdOutlineCancel size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-600 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type={key === 'quantity' || key === 'originalPrice' || key === 'discount' ? 'number' : 'text'}
              name={key}
              value={formData[key]}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md flex items-center gap-2 hover:bg-blue-600"
        >
          <BiSave />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProducts;
