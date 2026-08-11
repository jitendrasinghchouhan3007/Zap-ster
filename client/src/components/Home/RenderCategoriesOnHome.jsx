import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner";


const fetchHomeCategories = async (fetchApi) => {
  const response = await axios.get(fetchApi);
  return response.data.categories;
};

const RenderCategoriesOnHome = () => {

  const navigate = useNavigate();

  const {
    data: homeCategory,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["home-category", `${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories`],
    queryFn: () => fetchHomeCategories(`${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories`),
    staleTime: 5 * 60 * 1000,
  });
  return (
    <>
     {isLoading ? (
          <Spinner  cssStyle="my-[4rem]"/>
        ) : isError ? (
          <p className="text-center text-red-500">Error loading products!</p>
        ) : (
<div className="flex items-center gap-8 m-4 overflow-x-scroll md:px-5 hide-scrollbar">
{homeCategory?.map((category) => (
  <div
    key={category._id}
    className="rounded-full flex-shrink-0 transition-transform transform  hover:scale-95 cursor-pointer"
  >
    <div
      onClick={() => navigate(`category/${category.slug}`)}
      className="text-center"
    >
      <div className="w-24 h-24 md:w-32 md:h-32 border-4 border-gray-200 dark:border-dark rounded-full bg-white dark:bg-B overflow-hidden hover:shadow-lg flex items-center justify-center">
        <img
          className="w-full h-full object-cover"
          src={category.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80"}
          alt={`${category.name} category`}
        />
      </div>
      <h2 className="font-semibold dark:text-white mt-1">{category.name}</h2>
    </div>
  </div>
))}

<button
  className="underline hover:text-blue-500 text-C"
  onClick={() => navigate("/all-categories")}
>
  More
</button>
</div>
        )}
    </>
  );
};

export default RenderCategoriesOnHome;
