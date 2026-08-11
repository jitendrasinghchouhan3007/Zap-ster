import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ name, navTo, TypeName }) => {
  return (
    <>
      <div className="flex items-center gap-2 mb-3 justify-center md:justify-normal text-gray-500 font-semibold ">
        <Link to="/" className="hover:text-blue-500 hover:underline">
          Home
        </Link>
        {">"}
        <Link to={navTo} className="hover:text-blue-500 hover:underline">
          {TypeName}
        </Link>
        {">"}
         <span>{name}</span>
      </div>
    </>
  );
};

export default Breadcrumb;
