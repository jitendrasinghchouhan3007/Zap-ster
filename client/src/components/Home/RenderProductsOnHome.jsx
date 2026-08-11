import React from "react";
import axios from "axios";
import Spinner from "../Spinner";
import ProductCard from "../ProductCard";
import { useQuery } from "@tanstack/react-query";

const fetchFeaturedProducts = async (fetchApi) => {
  const response = await axios.get(fetchApi);
  return response.data.products;
};

const RenderProductsOnHome = ({ heading, fetchApi }) => {
  const {
    data: featuredProducts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["featured-products", fetchApi],
    queryFn: () => fetchFeaturedProducts(fetchApi),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <>
      <div className="md:px-14 px-5 pb-14 bg-white mx-6 mb-8 shadow border">
        <div className="flex items-center gap-1 py-4">
          <h2 className="md:text-2xl text-lg font-bold py-6">{heading}</h2>
        </div>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="text-center text-red-500">Error loading products!</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard product={product} key={product._id} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default RenderProductsOnHome;
