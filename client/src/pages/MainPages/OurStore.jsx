import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { FaBoxOpen } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import ProductCard from '../../components/ProductCard';
import { Helmet } from 'react-helmet';

const fetchProducts = async ({ pageParam = 0 }) => {
  const limit = 8;
  const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/product/all-products?limit=${limit}&skip=${pageParam}`);
  return data;
};

const OurStore = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.hasMore ? allPages.length * lastPage.limit : undefined,
  });

  const products = data?.pages.flatMap(page => page.products) || [];

  return (
    <div className="px-4">
       <Helmet>
        <title>Zapster.com | Store</title>
      </Helmet>

      <h1 className="text-3xl font-bold my-8 text-center">Our Store - All Products</h1>
      
      <InfiniteScroll
        dataLength={products.length}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Spinner />}
        endMessage={
          <p className={`text-center my-4 text-gray-500 ${isFetching ? "hidden" : "block"}`}>
            <FaBoxOpen className="inline mr-2" />
            No more products
          </p>
        }
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 md:mx-6">
          {products.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </InfiniteScroll>
      
      {isFetching && !isFetchingNextPage && <Spinner />}
    </div>
  );
};

export default OurStore;