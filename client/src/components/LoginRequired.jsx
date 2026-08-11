import React from "react";
import { Helmet } from "react-helmet";
import { FaLock, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LoginRequired = ({content,title}) => {
  const navigate = useNavigate();

  return (
    <div className=" flex  justify-center  m-10">
        <Helmet>
        <title>Zapster.com | Login Required</title>
      </Helmet>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center mb-6">
          <FaLock className="text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-600 mt-2">
           {content}
          </p>
        </div>
        <button className="w-full bg-C hover:bg-gray-300 text-black py-2 px-4 rounded-lg  transition duration-300 flex items-center justify-center font-semibold " onClick={() => navigate("/login")}>
          <FaSignInAlt className="mr-2" />
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginRequired;