import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner";

const fetchHomeBrands = async (fetchApi) => {
  const response = await axios.get(fetchApi);
  return response.data.brands;
};

const RenderBrandsOnHome = () => {
  const {
    data: homeBrands,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["home-brands", `${import.meta.env.VITE_HOST_URI}/api/v1/brand/all-brands`],
    queryFn: () => fetchHomeBrands(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/all-brands`),
    staleTime: 5 * 60 * 1000,
  });

  const navigate = useNavigate();

  return (
    <>
      <div className="md:px-14 px-5 bg-white mx-6 mb-8 shadow border">
        <h2 className="md:text-2xl text-lg  font-bold pt-6 ">Shop by Brands</h2>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="text-center text-red-500">Error loading products!</p>
        ) : (
          <div className=" flex md:gap-14 items-center overflow-scroll hide-scrollbar md:p-5 ">
            {homeBrands?.map((brand) => (
              <div
                className="flex-shrink-0 w-36 transition-transform transform  hover:scale-110 px-2"
                key={brand.slug}
                onClick={() => navigate(`/brand/${brand.slug}`)}
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="md:w-36 w-28 object-cover cursor-pointer "
                />
              </div>
            ))}
            <button
              className="underline hover:text-blue-500 text-C"
              onClick={() => navigate("/all-brands")}
            >
              More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default RenderBrandsOnHome;
