import React from "react";
import { Outlet ,Link} from "react-router-dom";



const AuthLayout = () => {
  return (
    <div className="flex  flex-col items-center justify-center bg-gray-100 mx-5 ">
      <div className="w-full max-w-md ">
        <div className="text-center mb-8 mt-4">
          <Link to="/" className="text-5xl font-bold ">
            
          </Link>
        </div>
        <Outlet />
      </div>
      <footer className="border-t-2 w-full py-6 text-center ">
        <div className="flex gap-2 justify-center text-sm pb-2">
          <Link
            to="/"
            className="hover:text-blue-600 hover:underline text-blue-500"
          >
            Home
          </Link>
          {"/"}
          <Link
            to="/terms-and-conditions"
            className="hover:text-blue-600 hover:underline text-blue-500"
          >
            Terms & Conditions
          </Link>
          {"/"}
          <Link
            to="/privacy-policy"
            className="hover:text-blue-600 hover:underline text-blue-500"
          >
            Privacy Policy
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          &copy;{new Date().getFullYear()}, Zapster.com, Inc. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
