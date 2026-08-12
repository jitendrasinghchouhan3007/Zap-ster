import React from "react";
import { useAuth } from "../context/auth";
import { toast } from "react-hot-toast";
import { IoMdPower } from "react-icons/io";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TbCategoryPlus } from "react-icons/tb";
import { SiBrandfolder } from "react-icons/si";
import { IoOptions } from "react-icons/io5";
import { LuClipboardCheck } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import ProfilePicture from "../components/ProfilePicture";

const AdminPanelLayout = () => {
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
        <nav className=" w-full md:max-w-sm  md:sticky self-start top-1">
          <h1 className="text-3xl pb-4 font-bold ">Admin Panel</h1>
          <div className="relative flex flex-col py-4 bg-white rounded-lg shadow-md border mx-8 items-center ">
           <ProfilePicture/>
            <h1 className="font-bold text-center">{auth.user?.fullname || auth.user?.name || "Admin"}</h1>
            <span className="absolute left-2 bg-gray-200 text-[10px] font-semibold text-gray-500 px-3 py-1 rounded ">
              {auth.user.role}
            </span>
          </div>

          <ul className="flex flex-wrap md:block gap-8 justify-center items-center bg-white rounded-lg shadow-md border  mx-8 my-5  p-4">
            <li className="flex flex-col md:flex-row items-center justify-center gap-1 md:pb-2 md:border-b">
              <TbCategoryPlus size={18} />
              <span className="hover:text-blue-600">
                <Link to="/manage-categories">Manage Categories</Link>
              </span>
            </li>

            <li className=" flex flex-col md:flex-row items-center justify-center gap-1 py-2 md:border-b">
              <SiBrandfolder size={18} />{" "}
              <span className="hover:text-blue-600">
              <Link to="/manage-brands">Brands Management</Link>
              </span>
            </li>

            <li className=" flex flex-col md:flex-row items-center justify-center gap-1 py-2 md:border-b">
              <IoOptions size={18} />{" "}
              <Link className="hover:text-blue-600" to="/manage-products">Manage Products</Link>
            </li>

            <li className=" flex flex-col md:flex-row items-center justify-center gap-1 py-2 md:border-b">
              <LuClipboardCheck size={18} />{" "}
              <span className="hover:text-blue-600"><Link to="/all-orders">All Orders</Link></span>
            </li>

            <li className=" flex flex-col md:flex-row items-center justify-center gap-1 py-2 md:border-b">
              <PiUsersThree size={18} />
              <span className="hover:text-blue-600">  <Link to="/all-users">All Users</Link></span>
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

export default AdminPanelLayout;
