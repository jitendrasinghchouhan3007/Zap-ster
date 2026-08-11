import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa6";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";
import RenderInputTag from "../../components/RenderInputTag";
import OopsNotFound from "../../components/OopsNotFound";
import Modal from "../../components/Modal";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Helmet } from "react-helmet";

const initialFormData = {
  name: "",
  locality: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  phoneNumber: "",
  addressType: "",
};

const AllAddresses = () => {
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [display, setDisplay] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  const fetchAllAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_HOST_URI}/api/v1/address/all-address/${auth.user._id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setAllAddresses(response.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URI}/api/v1/address/${auth.user._id}/create-address`,
        formData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (response.data && response.data.user) {
        toast.success("Address added successfully");
      
        setLoading(false);
        setDisplay(false);
        setFormData(initialFormData);
        fetchAllAddresses();
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        setAuth({});
        localStorage.removeItem("auth");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Error adding address");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_HOST_URI}/api/v1/address/delete-address/${selectedAddressId}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      toast.success("Address deleted successfully");
      fetchAllAddresses();
      toggleModal();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAddresses();
  }, []);

  return (
    <div className="bg-white border shadow-md rounded p-5">
        <Helmet>
        <title>Zapster.com | Manage Addresses</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-6">Manage Addresses</h1>
      <div
        className={`border ${
          display ? "bg-blue-50" : ""
        } px-5 py-3 mx-5 rounded text-sm border-gray-300`}
      >
        <div
          className={`flex items-center font-semibold gap-3 text-blue-500 ${
            display ? "cursor-text" : "cursor-pointer"
          }`}
          onClick={() => !display && setDisplay(true)}
        >
          {!display && <FaPlus />}
          ADD A NEW ADDRESS
        </div>

        {display && (
          <form onSubmit={handleSubmit} className="mt-5 grid grid-cols-2 gap-6">
            <RenderInputTag
              label="Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
            <RenderInputTag
              label="Mobile Number"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <RenderInputTag
              label="Pincode"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
            <RenderInputTag
              label="Locality"
              id="locality"
              value={formData.locality}
              onChange={handleChange}
            />
            <textarea
              rows="3"
              id="street"
              className="border transition-all duration-300 rounded-lg focus:outline-none col-span-2 focus:border-blue-500 p-4"
              placeholder="Address (Area and Street)"
              value={formData.street}
              onChange={handleChange}
            />
            <RenderInputTag
              label="City/District/Town"
              id="city"
              value={formData.city}
              onChange={handleChange}
            />
            <RenderInputTag
              label="State"
              id="state"
              value={formData.state}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="addressType" className="text-sm text-gray-600">
                Address Type
              </label>
              <div className="flex gap-8 items-center pt-3 pl-5">
                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    id="addressType"
                    name="addressType"
                    value="Home"
                    checked={formData.addressType === "Home"}
                    onChange={handleChange}
                  />
                  Home
                </div>

                <div className="flex items-center gap-1">
                  <input
                    type="radio"
                    id="addressType"
                    name="addressType"
                    value="Work"
                    checked={formData.addressType === "Work"}
                    onChange={handleChange}
                  />
                  Work
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8 mt-5 col-span-2">
              {allAddresses.length >= 5 ? (
                <p className="text-red-500 font-semibold">
                  Cann't Add more Address
                </p>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="shadow hover:bg-blue-700 bg-blue-500 font-semibold text-white px-8 py-2 rounded disabled:bg-gray-200"
                >
                  {loading ? "Please wait..." : "SAVE"}
                </button>
              )}
              <button
                type="button"
                className="font-semibold hover:text-blue-800 text-blue-500"
                onClick={() => setDisplay(false)}
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="mx-5 mt-6 rounded text-sm border-gray-300 min-h-80">
        {loading ? (
          <Spinner cssStyle=" pt-[8rem]" />
        ) : allAddresses.length === 0 ? (
          <>
            <OopsNotFound content="No Address Found" />
          </>
        ) : (
          <>
            {allAddresses.map((a) => (
              <div className="border p-5 border-gray-300" key={a._id}>
                <div className="relative flex justify-between items-center">
                  <span className="bg-gray-200 text-[10px] font-semibold text-gray-500 px-3 py-1 rounded">
                    {a.addressType.toUpperCase()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAddressId(a._id);
                        toggleModal();
                      }}
                    >
                      <RiDeleteBin2Line size={20} />
                    </button>
                  </div>
                </div>
                <p className="mt-4 mb-2">
                  <span className="font-semibold mr-6">{a.name}</span>
                  <span className="font-semibold">{a.phoneNumber}</span>
                </p>
                <p className="text-sm text-gray-700">
                  {a.street}, {a.locality}, {a.city}, {a.state} -{" "}
                  <span className="font-semibold text-black">
                    {a.postalCode}
                  </span>
                </p>
              </div>
            ))}
          </>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          content={
            <>
              <h2 className="font-bold text-lg ">
                Are you sure you want to delete this address?
              </h2>
              <div className="flex gap-5 mt-5">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="shadow hover:bg-blue-700 bg-blue-500 font-semibold text-white px-8 py-2 rounded disabled:bg-gray-200"
                >
                  Yes,Delete
                </button>
                <button
                  type="button"
                  className="font-semibold hover:text-blue-800 text-blue-500"
                  onClick={toggleModal}
                >
                  CANCEL
                </button>
              </div>
            </>
          }
        />
      </div>
    </div>
  );
};

export default AllAddresses;
