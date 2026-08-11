import React, { useState } from "react";
import { LuFileEdit } from "react-icons/lu";
import { AiOutlineDelete } from "react-icons/ai";
import axios from "axios";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const MyProfile = () => {
  const [changeText, setChangeText] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullname: auth.user.fullname,
    email: auth.user.email,
    mobile: auth.user.mobile,
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleClick = () => {
    setChangeText(!changeText);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/auth/update-profile-info`,
        userData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (response.data && response.data.user) {
        const updatedUser = { ...auth, user: response.data.user };
        setAuth(updatedUser); 
        setUserData(response.data.user); 
        localStorage.setItem("auth", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully");
        setLoading(false);
        setChangeText(!changeText);
      } else {
        toast.error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.status === 401) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error(error.response?.data?.error || "Error updating profile");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account permanently? This action cannot be undone.")) {
      setDeleteLoading(true);
      try {
        const response = await axios.delete(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/deleteUserPermanently`, {
          headers: {
            Authorization: auth.token,
          },
        });

        if (response.data.success) {
          toast.success("Account deleted successfully");
          setAuth({ user: null, token: null });
          localStorage.removeItem("auth");
          navigate("/");
        } else {
          toast.error(response.data.message || "Error deleting account");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error(error.response?.data?.message || "Error deleting account");
      } finally {
        setDeleteLoading(false);
      }
    }
  };



  return (
    <div className="bg-white border shadow-md rounded">
        <Helmet>
        <title>Zapster.com | My Profile</title>
      </Helmet>

      <div className="p-5">
        <div className="relative flex gap-6 items-baseline">
          <h1 className="text-xl font-bold">Personal Information</h1>
          <button
            className={`text-blue-500 hover:text-blue-800 font-bold`}
            onClick={handleClick}
          >
            {changeText ? "Cancel" : (
              <div className="flex items-center">
                <span>Edit</span>
                <LuFileEdit />
              </div>
            )}
          </button>
          {changeText && (
            <button
              type="submit"
              onClick={handleSubmit}
              className={`absolute right-3 shadow hover:bg-blue-700 bg-blue-500 font-semibold text-white px-6 py-2 rounded disabled:bg-gray-400`}
              disabled={loading}
            >
             {loading ? "Please wait..." : " SAVE"}
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-5 flex gap-4 items-center w-fit">
            <label htmlFor="fullname" className="font-semibold">Name:</label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              value={userData.fullname}
              onChange={handleChange}
              disabled={!changeText}
              className={`border-b pb-1 border-blue-500 disabled:border-gray-200 outline-none text-gray-600 md:w-72 ${changeText ? "" : "cursor-not-allowed"}`}
            />
          </div>

          <div className="p-5 flex gap-4 items-center w-fit">
            <label htmlFor="email" className="font-semibold">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              disabled={!changeText}
              className={`border-b pb-1 outline-none border-blue-500 disabled:border-gray-200  text-gray-600 md:w-72 ${changeText ? "" : "cursor-not-allowed"}`}
            />
          </div>

          <div className="p-5 flex gap-4 items-center w-fit">
            <label htmlFor="mobile" className="font-semibold">Mobile:</label>
            <input
              type="text"
              name="mobile"
              id="mobile"
              onChange={handleChange}
              value={userData.mobile}
              disabled={!changeText}
              className={`border-b pb-1 outline-none border-blue-500 disabled:border-gray-200  text-gray-600 md:w-72 ${changeText ? "" : "cursor-not-allowed"}`}
            />
          </div>
        </form>
        <div className="border-y-2 p-5 text-sm mx-5">
          <h4 className="text-lg font-bold">FAQs (Frequently Asked Questions)</h4>
          <p className="font-semibold px-5 pt-5 text-gray-800">1. What happens when I update my email address (or mobile number)?</p>
          <p className="px-5 pb-3 text-gray-600">
            <span className="font-semibold">Ans.</span> Your login email id (or mobile number) changes, likewise. You'll receive all your account-related communication on your updated email address (or mobile number).
          </p>
          <p className="font-semibold px-5 pt-2 text-gray-800">2. What happens to my existing Flipkart account when I update my email address (or mobile number)?</p>
          <p className="px-5 pb-3 text-gray-600">
            <span className="font-semibold">Ans.</span> Updating your email address (or mobile number) doesn't invalidate your account. Your account remains fully functional. You'll continue seeing your order history, saved information, and personal details.
          </p>
        </div>
      </div>

      <div className="relative">
        <button 
          className="absolute left-10 font-bold text-red-600 flex items-center hover:text-red-800 disabled:opacity-10"
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting Please wait..." : "Delete Account Permanently"} <AiOutlineDelete size={22} />
        </button>
        <img
          src="../myProfileFooter.png"
          alt="myProfileFooterImg"
          className="rounded-b"
        />
      </div>
    </div>
  );
};

export default MyProfile;
