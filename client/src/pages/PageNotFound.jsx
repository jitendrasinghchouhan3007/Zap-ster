import React from "react";
import { Helmet } from "react-helmet";
import { FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <Helmet>
        <title>Zapster.com | Page not found</title>
      </Helmet>
      <div className="text-center mb-8 mt-4">
        <Link to="/" className="text-5xl font-bold ">
          
        </Link>
      </div>

      <div className="flex items-center justify-center  bg-gray-100">
        <div className="text-center p-6 max-w-lg bg-white shadow-md rounded-lg">
          <FaExclamationTriangle
            size={50}
            className="text-yellow-500 text-6xl mb-4 mx-auto"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            404 - Page Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The page you are looking for does not exist. It might have been
            moved or deleted.
          </p>
          <Link
            to="/"
            className="px-4 py-2 inline-block mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-800"
          >
            Go Home
          </Link>
        </div>
      </div>
      <div className="text-sm text-center text-gray-500 mt-5">
          &copy;{new Date().getFullYear()}, Zapster.com, Inc. All rights
          reserved.
        </div>
    </>
  );
};

export default PageNotFound;
