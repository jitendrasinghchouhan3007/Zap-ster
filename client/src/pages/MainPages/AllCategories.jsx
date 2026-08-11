import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const fetchCategories = async ({ pageParam = 1 }) => {
  const response = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories`, {
    params: { page: pageParam },
  });
  return response.data;
};

const AllCategories = () => {
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["categories"],
    queryFn: ({ pageParam = 1 }) => fetchCategories({ pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.categories.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  return (
    <div>
       <Helmet>
        <title>Zapster.com | All Categories</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center border-b py-5 bg-white shadow-md">
        All Categories
      </h1>
      <InfiniteScroll
        dataLength={data?.pages.flatMap((page) => page.categories).length || 0}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<Spinner cssStyle="my-2" />}
        endMessage={
          <p className="text-center my-6 text-gray-600">
            You have seen all Categories!
          </p>
        }
      >
        <div className="grid md:grid-cols-5 grid-cols-2 gap-4 px-14 my-7">
          {data?.pages.flatMap((page) => page.categories).map((cat) => (
            <div
              key={cat._id}
              className="flex flex-col items-center justify-center overflow-hidden transition-transform transform hover:scale-95 cursor-pointer"
              onClick={() => navigate(`/category/${cat.slug || cat.name}`)}
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-gray-200 overflow-hidden shadow-md bg-white flex items-center justify-center">
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-semibold text-center mt-2 text-gray-800">{cat.name}</h2>
            </div>
          ))}
        </div>
      </InfiniteScroll>

      {isFetching && !isFetchingNextPage ? <Spinner /> : null}
    </div>
  );
};

export default AllCategories;
