import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Spinner from '../../components/Spinner'; 
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet';

const fetchBrands = async ({ pageParam = 1 }) => {
  const response = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/all-brands`, {
    params: { page: pageParam },
  });
  return response.data;
};

const AllBrands = () => {
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['brands'],
    queryFn: ({ pageParam = 1 }) => fetchBrands({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.brands.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  return (
    <div>
       <Helmet>
        <title>Zapster.com | All Brands</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center border-b py-5 bg-white shadow-md">All Brands</h1>
      <InfiniteScroll
        dataLength={data?.pages.flatMap((page) => page.brands).length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Spinner cssStyle="my-2" />}
        endMessage={
          <p className="text-center my-6 text-gray-600">You have seen all brands!</p>
        }
      >
        <div className="grid md:grid-cols-5 grid-cols-2 gap-4 px-14 my-7">
          {data?.pages.flatMap((page) => page.brands).map((brand) => (
            <div key={brand._id} className="flex flex-col items-center justify-center overflow-hidden transition-transform transform hover:scale-105 cursor-pointer bg-white p-4 border rounded-xl shadow-sm" onClick={() => navigate(`/brand/${brand.slug || brand.name}`)}>
              <div className="w-full h-28 flex items-center justify-center">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <h2 className="font-semibold text-center mt-2 text-gray-800">{brand.name}</h2>
            </div>
          ))}
        </div>
      </InfiniteScroll>
      {isFetching && !isFetchingNextPage ? <Spinner /> : null}
    </div>
  );
};

export default AllBrands;
