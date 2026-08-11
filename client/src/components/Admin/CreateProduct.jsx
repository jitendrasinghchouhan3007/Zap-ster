import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from "react-icons/ai";

const CreateProduct = ({ setDisplay, onCreated }) => {
  const [auth] = useAuth();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
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
    images: [],
  });

  const fileInputRef = useRef();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/all-brands`);
        setBrands(data.brands || []);
      } catch (error) {
        toast.error("Error fetching brands");
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories`);
        setCategories(data.categories || []);
      } catch (error) {
        toast.error("Error fetching categories");
      }
    };

    fetchBrands();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imagesPreview.length > 4) {
      toast.error("Only upload up to 4 product pictures");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const previewImages = files.map((file) => URL.createObjectURL(file));
    setImagesPreview((prev) => [...prev, ...previewImages]);
  };

  const handleImageRemove = (index) => {
    setImagesPreview((prev) => prev.filter((_, idx) => idx !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const productFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((image) =>
          productFormData.append("images", image)
        );
      } else {
        productFormData.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/create-product`,
        productFormData,
        {
          headers: {
            Authorization: auth.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response.data.message || "Product created successfully!");
      if (onCreated) {
        onCreated();
      } else {
        setDisplay(false);
      }
      setFormData({
        name: "",
        description: "",
        originalPrice: "",
        discount: "",
        category: "",
        brand: "",
        quantity: "",
        tags: "",
        images: [],
      });
      setImagesPreview([]);
    } catch (error) {
      toast.error("Error creating product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Brand
          </label>
          <select
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          >
            <option value="">Select a brand</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          rows="4"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Original Price
          </label>
          <input
            type="number"
            name="originalPrice"
            min={0}
            value={formData.originalPrice}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            type="number"
            name="discount"
            min={0}
            max={100}
            value={formData.discount}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Tags
        </label>
        <div className="flex">
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="Add tags (add commas to sperate )"
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Product Images (Max: 4)
        </label>
        <div
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition duration-200"
          onClick={() => fileInputRef.current.click()}
        >
          <div className="space-y-1 text-center">
            <AiOutlineCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                <span>Upload files</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  disabled={formData.images.length === 4}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only disabled:cursor-not-allowed"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {imagesPreview.map((image, idx) => (
          <div key={idx} className="relative group">
            <img
              src={image}
              alt={`Preview ${idx + 1}`}
              className="w-full h-32 object-contain rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
              <AiOutlineCloseCircle
                className="text-white text-2xl cursor-pointer hover:text-red-500 transition duration-200"
                onClick={() => handleImageRemove(idx)}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className=" px-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium text-lg disabled:bg-gray-500 disabled:hover:bg-gray-500"
        disabled={loading}
      >
        {loading ? "Creating Product..." : "Create Product"}
      </button>
      <button
        type="button"
        className="font-semibold hover:text-blue-800 text-blue-500 mx-10 disabled:line-through disabled:hover:text-gray-600 disabled:text-gray-600"
        onClick={() => setDisplay(false)}
        disabled={loading}
      >
        CANCEL
      </button>
    </form>
  );
};

export default CreateProduct;
