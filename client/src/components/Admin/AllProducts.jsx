import React, { useState, useEffect } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminProductCard from "./AdminProductCard";
import { toast } from "react-hot-toast";
import Modal from "../Modal";
import EditProducts from "./EditProducts";

const fetchProducts = async ({ pageParam = 0 }) => {
  const limit = 8;
  const { data } = await axios.get(
    `${import.meta.env.VITE_HOST_URI}/api/v1/product/all-products?limit=${limit}&skip=${pageParam}`
  );
  return data;
};

const handleDelete = async (productID, refetch) => {
  const isConfirmed = window.confirm(
    "Are you sure you want to delete this product?"
  );

  if (!isConfirmed) return;
  try {
    const response = await axios.delete(`${import.meta.env.VITE_HOST_URI}/api/v1/product/delete/${productID}`);
    if (response.status === 200) {
      refetch();
      toast.success("Product deleted successfully.");
    }
  } catch (error) {
    console.error("Error deleting the product:", error);
    toast.error("There was an error deleting the product.");
  }
};

// refetchRef: optional React ref — when provided, we store our refetch fn so parent can trigger it
const AllProducts = ({ refetchRef }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [slug, setSlug] = useState(null);

  const handleSetId = (productId) => {
    setSlug(productId);
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["admin-products"],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore
        ? (allPages?.length ?? 0) * (lastPage.limit ?? 8)
        : undefined,
  });

  // Expose refetch to parent via ref
  useEffect(() => {
    if (refetchRef) refetchRef.current = refetch;
  }, [refetch, refetchRef]);

  const products = data?.pages.flatMap((page) => page.products) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        All Products
      </h1>
      <div className="rounded-lg p-6">
        <InfiniteScroll
          dataLength={products.length}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          }
          endMessage={
            <p
              className={`text-center my-4 text-gray-500 ${
                isFetching ? "hidden" : null
              } `}
            >
              <FaBoxOpen className="inline mr-2" />
              No more products
            </p>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product, index) => (
              <AdminProductCard
                key={product._id}
                product={product}
                index={index}
                navigate={navigate}
                handleDelete={() => handleDelete(product._id, refetch)}
                isOpen={isOpen}
                setISOpen={setIsOpen}
                setSlug={() => handleSetId(product.slug)}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
      {isFetching && !isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Edit Products modal component */}

      <Modal
        isOpen={isOpen}
        content={
          <EditProducts slug={slug} isOpen={isOpen} setIsOpen={setIsOpen} refetch={refetch} />
        }
      />
    </div>
  );
};

export default AllProducts;
