import React, { useState, useRef } from "react";
import { FaPlus } from "react-icons/fa6";
import CreateProduct from "../../components/Admin/CreateProduct";
import AllProducts from "../../components/Admin/AllProducts";
import { Helmet } from "react-helmet";

const ManageProducts = () => {
  const [display, setDisplay] = useState(false);
  // ref to hold AllProducts' refetch so CreateProduct can trigger it
  const refetchRef = useRef(null);

  const handleProductCreated = () => {
    setDisplay(false);
    // immediately refresh the product list
    if (refetchRef.current) refetchRef.current();
  };

  return (
    <div className="bg-white border shadow-md rounded p-5">
      <Helmet>
        <title>Zapster.com |Admin-Manage Products</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-6">Manage Products</h1>
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
          ADD A NEW PRODUCT
        </div>

        {display && (
          <CreateProduct setDisplay={setDisplay} onCreated={handleProductCreated} />
        )}
      </div>

      <div className="my-5">
        <AllProducts refetchRef={refetchRef} />
      </div>
    </div>
  );
};

export default ManageProducts;
