import React, { useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaCamera, FaTrash, FaSpinner } from "react-icons/fa";

const ProfilePicture = () => {
  const [auth, setAuth] = useAuth();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/auth/updateProfilePic`,
        formData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      if (response.data.success) {
        setAuth({ ...auth, user: response.data.user });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: response.data.user })
        );
        toast.success("Profile picture updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProfilePic = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/deleteProfilePic `, {
        headers: {
          Authorization: auth.token,
        },
      });

      if (response.data.success) {
        setAuth({ ...auth, user: response.data.user });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: response.data.user })
        );
        toast.success("Profile picture removed successfully");
      }
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      toast.error("Failed to remove profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-36 h-36 mx-auto mb-4">
      <div
        className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={
            auth.user.profilePicture === ""
              ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              : auth.user.profilePicture
          }
          alt={auth.user.fullname}
          className="w-full h-full object-cover"
        />
        {isHovering && !isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <label htmlFor="profile-pic-upload" className="cursor-pointer">
              <FaCamera className="text-white w-8 h-8" title="Upload Profile Picture"/>
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-full">
          <FaSpinner className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      )}
      {auth.user.profilePicture && !isLoading && (
        <button
          onClick={handleDeleteProfilePic}
          className="absolute bottom-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        >
          <FaTrash className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ProfilePicture;