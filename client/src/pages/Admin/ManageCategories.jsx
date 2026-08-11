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

const fetchCategories = async ({ pageParam = 0 }) => {
  const limit = 8;
  const { data } = await axios.get(
    `${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories?limit=${limit}&skip=${pageParam}`
  );
  return data;
};

const ManageCategories = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length * lastPage.limit : undefined,
  });

  const [editingCategories, setEditingCategories] = useState({});
  const [categoryNames, setCategoryNames] = useState({});
  const [loading ,setLoading]= useState(false);
  
  const inputRefs = useRef({});

  const rawCategories = data?.pages.flatMap((page) => page.categories) || [];
  const categories = Array.from(
    new Map(rawCategories.map((c) => [c._id || c.name.toLowerCase(), c])).values()
  );

  const handleDelete = async (categoryID) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );
  
    if (!isConfirmed) return;
    try {
      alert("This process may take some time as it deletes all related Products to the category. You will be notified when the process is complete");
      
      const response = await axios.delete(`${import.meta.env.VITE_HOST_URI}/api/v1/category/delete-category/${categoryID}`);
     
      if (response.status === 200) {
        refetch();
        toast.success("Category deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting the category:", error);
      toast.error("There was an error deleting the category.");
    }
  };

  const handleEditToggle = (categoryId, currentName) => {
    setEditingCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));

    if (!categoryNames[categoryId]) {
      setCategoryNames(prev => ({
        ...prev,
        [categoryId]: currentName
      }));
    }

    if (!editingCategories[categoryId]) {
      setTimeout(() => {
        inputRefs.current[categoryId]?.focus();
      }, 0);
    }
  };

  const handleNameChange = (categoryId, newName) => {
    setCategoryNames(prev => ({
      ...prev,
      [categoryId]: newName
    }));
  };

  const handleUpdateCategory = async (categoryId) => {
    try {
      setLoading(true)
      const response = await axios.put(`${import.meta.env.VITE_HOST_URI}/api/v1/category/update-category/${categoryId}`, {
        name: categoryNames[categoryId]
      });

      if (response.status === 200) {
        
        setEditingCategories(prev => ({
          ...prev,
          [categoryId]: false
        }));
        refetch();   
        toast.success("Category updated successfully.");
        setLoading(false)
      }
    } catch (error) {
      console.error("Error updating the category:", error);
      toast.error("There was an error updating the category.");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="bg-white rounded border shadow p-5 min-h-screen">
        <Helmet>
        <title>Zapster.com |Admin-Manage Categories</title>
      </Helmet>
      <CreateBrandAndCategory type={"category"} typeName={"Category"} refetch={refetch}/>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          All Categories
        </h1>

        <div>
          <InfiniteScroll
            dataLength={categories.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            }
            endMessage={
              <p className="text-center my-6 text-gray-600">
                You have seen all Categories!
              </p>
            }
          >
            <div className="grid md:grid-cols-4 grid-cols-2 gap-3 my-7">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="border-4 flex flex-col justify-center overflow-hidden rounded-lg"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="object-contain"
                  />
                  {editingCategories[cat._id] ? (
                    <input 
                      ref={(el) => inputRefs.current[cat._id] = el}
                      value={categoryNames[cat._id] || cat.name}
                      onChange={(e) => handleNameChange(cat._id, e.target.value)}
                      className="font-semibold text-center mt-1 border px-2 py-1"
                    />
                  ) : (
                    <input 
                      readOnly 
                      value={cat.name} 
                      className="font-semibold text-center mt-1 px-2 py-1"
                    />
                  )}
                  <div className="flex my-2 justify-center">
                    {editingCategories[cat._id] ? (
                      <button
                        onClick={() => handleUpdateCategory(cat._id)}
                        className="px-3 py-1 flex items-center shadow rounded-full bg-green-100 hover:shadow-lg disabled:opacity-35"
                        disabled={loading}
                      >
                       {loading? "wait...": <> <FaSave className="mr-1" /> Save</>}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditToggle(cat._id, cat.name)}
                        className="px-3 py-1 flex items-center shadow rounded-full bg-gray-100 hover:shadow-lg"
                      >
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cat._id)}
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

export default ManageCategories;