import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import axios from "axios";
import {toast} from "react-hot-toast";

const CreateBrandAndCategory = ({type,typeName,refetch}) => {
  const [displayOn, setDisplayOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      toast.error("Please provide all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", image);

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URI}/api/v1/${type}/create-${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(response?.data?.message||"created Succesfully");
      refetch();
      setName("");
      setImage(null);
      setPreview(null);
      setDisplayOn(false);
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setName("");
      setImage(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
      <h1 className="text-xl font-bold mb-6">Manage {typeName}</h1>

      <div
        className={`border ${
          displayOn ? "bg-blue-50" : ""
        } px-5 py-3 mx-5 rounded text-sm border-gray-300`}
      >
        <div
          className={`flex items-center font-semibold gap-3 text-blue-500  ${
            displayOn ? "cursor-text mb-5 " : "cursor-pointer"
          }`}
          onClick={() => !displayOn && setDisplayOn(true)}
        >
          {!displayOn && <FaPlus />}
          ADD A NEW {type.toUpperCase()}
        </div>
        {displayOn && (
          <>
            <form onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {typeName} Name
                </label>
                <input
                  type="text"
                  name={type}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  placeholder={`Enter ${type} name`}
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {typeName} Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 shadow-sm"
                  
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 w-40 h-40 object-cover border border-gray-300 rounded shadow-md"
                  />
                )}
              </div>

              <button
                type="submit"
                className="px-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition duration-300 font-medium text-lg shadow-md disabled:bg-gray-500 disabled:hover:bg-gray-500 mt-4"
                disabled={loading}
              >
                {loading ? `Creating ${typeName}...` : `Create ${typeName}`}
              </button>
              <button
                type="button"
                className="font-semibold hover:text-blue-800 text-blue-500 mx-10 disabled:line-through disabled:hover:text-gray-600 disabled:text-gray-600 transition duration-200"
                onClick={() => {
                  setDisplayOn(false);
                  setName("");
                  setImage(null);
                  setPreview(null);
                }}
                disabled={loading}
              >
                CANCEL
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateBrandAndCategory;
