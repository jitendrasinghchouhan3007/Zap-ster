import React from "react";
import { useAuth } from "../context/auth";
import { LuUser } from "react-icons/lu";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { IoMdPower } from "react-icons/io";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../components/ProfilePicture";

const ProfileLayout = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
    toast.success("Logout Successful");
    navigate("/");
  };

  return (
    <>
      <div className="md:flex   mx-5  my-5">
        <nav className=" w-full md:max-w-sm md:sticky self-start top-1 ">
          <h1 className="text-3xl pb-4 font-bold ">Profile</h1>
          <div className=" flex flex-col py-4 bg-white rounded-lg shadow-md border mx-8 items-center ">
          <ProfilePicture />
            <h1 className="font-bold text-center">{auth.user.fullname}</h1>
          </div>

          <ul className="flex flex-wrap md:block gap-8 justify-center items-center bg-white rounded-lg shadow-md border  mx-8 my-5  p-4">
            <li className="flex flex-col md:flex-row items-center justify-center gap-1 md:pb-2 md:border-b">
              <LuUser size={18} />
              <span className="hover:text-blue-600">
                <Link to="/profile">Profile Information</Link>
              </span>
            </li>

            <li className=" flex flex-col md:flex-row items-center justify-center gap-1 py-2 md:border-b">
              <MdOutlineAddLocationAlt size={18} />{" "}
              <span className="hover:text-blue-600">
                <Link to="/manage-addresses">Manage Addresses</Link>
              </span>
            </li>

            <li className=" flex flex-col md:flex-row items-center justify-center gap-1 py-2 md:border-b">
              <BsBoxSeam size={18} />{" "}
              <span className="hover:text-blue-600">
                <Link to="/my-orders">My Orders</Link>
              </span>
            </li>

            <li className=" flex  flex-col md:flex-row items-center justify-center gap-1 md:pt-2 ">
              <IoMdPower size={18} />{" "}
              <span
                className="hover:text-blue-600 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </span>
            </li>
          </ul>
        </nav>
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ProfileLayout;
