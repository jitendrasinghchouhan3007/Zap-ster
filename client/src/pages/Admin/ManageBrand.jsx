import React, { useState, useRef } from "react";
import CreateBrandAndCategory from "../../components/Admin/CreateBrandAndCategory";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";

const fetchBrands = async ({ pageParam = 0 }) => {
  const limit = 8;
  const { data } = await axios.get(
    `${import.meta.env.VITE_HOST_URI}/api/v1/brand/all-brands?limit=${limit}&skip=${pageParam}`
  );
  return data;
};

const ManageBrand = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["admin-brands"],
    queryFn: fetchBrands,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore
        ? (allPages?.length ?? 0) * (lastPage.limit ?? 8)
        : undefined,
  });

  const [editingBrands, setEditingBrands] = useState({});
  const [brandNames, setBrandNames] = useState({});
  const [loading, setLoading] = useState(false);
  
  const inputRefs = useRef({});

  const rawBrands = data?.pages.flatMap((page) => page.brands) || [];
  const brands = Array.from(
    new Map(rawBrands.map((b) => [b._id || b.name.toLowerCase(), b])).values()
  );

  const handleDelete = async (brandId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this brand?"
    );
  
    if (!isConfirmed) return;
    try {
      const response = await axios.delete(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/delete-brand/${brandId}`);
      if (response.status === 200) {
        refetch();
        toast.success("Brand deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting the brand:", error);
      toast.error("There was an error deleting the brand");
    }
  };

  const handleEditToggle = (brandId, currentName) => {
    setEditingBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));

    if (!brandNames[brandId]) {
      setBrandNames(prev => ({
        ...prev,
        [brandId]: currentName
      }));
    }

    if (!editingBrands[brandId]) {
      setTimeout(() => {
        inputRefs.current[brandId]?.focus();
      }, 0);
    }
  };

  const handleNameChange = (brandId, newName) => {
    setBrandNames(prev => ({
      ...prev,
      [brandId]: newName
    }));
  };

  const handleUpdateBrand = async (brandId) => {
    try {
      setLoading(true);
      const response = await axios.put(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/update-brand/${brandId}`, {
        name: brandNames[brandId]
      });

      if (response.status === 200) {
        setEditingBrands(prev => ({
          ...prev,
          [brandId]: false
        }));
        refetch();   
        toast.success("Brand updated successfully.");
      }
    } catch (error) {
      console.error("Error updating the brand:", error);
      toast.error("There was an error updating the brand.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded border shadow p-5 min-h-screen">
       <Helmet>
        <title>Zapster.com |Admin-Manage Brands</title>
      </Helmet>
      <CreateBrandAndCategory type={"brand"} typeName={"Brand"} refetch={refetch}/>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          All Brands
        </h1>

        <div>
          <InfiniteScroll
            dataLength={brands.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
            endMessage={
              <p className="text-center my-6 text-gray-600">
                You have seen all Brands!
              </p>
            }
          >
            <div className="grid md:grid-cols-4 grid-cols-2 gap-3 my-7">
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="border-4 flex flex-col justify-center overflow-hidden rounded-lg"
                >
                  <div className="flex justify-center">
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="object-contain w-28 h-28"
                    />
                  </div>
                  {editingBrands[brand._id] ? (
                    <input 
                      ref={(el) => inputRefs.current[brand._id] = el}
                      value={brandNames[brand._id] || brand.name}
                      onChange={(e) => handleNameChange(brand._id, e.target.value)}
                      className="font-semibold text-center mt-1 border px-2 py-1"
                    />
                  ) : (
                    <input 
                      readOnly 
                      value={brand.name} 
                      className="font-semibold text-center mt-1 px-2 py-1"
                    />
                  )}
                  <div className="flex my-2 justify-center">
                    {editingBrands[brand._id] ? (
                      <button
                        onClick={() => handleUpdateBrand(brand._id)}
                        className="px-3 py-1 flex items-center shadow rounded-full bg-green-100 hover:shadow-lg disabled:opacity-35"
                        disabled={loading}
                      >
                        {loading ? "wait..." : <> <FaSave className="mr-1" /> Save</>}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditToggle(brand._id, brand.name)}
                        className="px-3 py-1 flex items-center shadow rounded-full bg-gray-100 hover:shadow-lg"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(brand._id)}
                      className="px-3 py-1 flex items-center"
                    >
                      <FaTrash className="ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
          {isFetching && !isFetchingNextPage && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageBrand;