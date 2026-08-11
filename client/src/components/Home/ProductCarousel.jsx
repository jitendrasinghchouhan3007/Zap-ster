import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Spinner from "../Spinner";
import ProductCardSecondary from "../ProductCardSecondary";


const fetchProducts = async (fetchApi) => {
  const response = await axios.get(fetchApi);
  return response.data.products;
};

const ProductCarousel = ({ heading, fetchApi }) => {
  const { data: featuredProducts, isLoading, isError } = useQuery({
    queryKey: ["products", fetchApi], 
    queryFn: () => fetchProducts(fetchApi), 
    staleTime: 5 * 60 * 1000, 
  });

  return (
    <div className="md:px-8 px-3 md:mt-14 my-6 ">
      <div className="border shadow pb-5 bg-white">
        <h2 className="md:text-2xl dark:text-white text-lg font-bold bg-white px-6 py-5 text-gray-900">
          {heading}
        </h2>

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="text-center text-red-500">Error loading products!</p>
        ) : (
          <div className="md:px-14 px-5">
            <div className="flex overflow-x-scroll custom-scrollbar py-3">
              {featuredProducts?.map((product) => (
                <ProductCardSecondary product={product} key={product._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCarousel;
