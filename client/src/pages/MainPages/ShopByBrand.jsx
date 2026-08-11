import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumb";
import { BsGrid, BsGrid3X3, BsListUl, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import Spinner from "../../components/Spinner";
import OopsNotFound from "../../components/OopsNotFound";
import ProductCard from "../../components/ProductCard";
import FilterBar from "../../components/FilterBar";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

const ShopByBrand = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState({});
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [grid, setGrid] = useState(() => parseInt(localStorage.getItem('grid-brand') || '4'));
  const [sort, setSort] = useState(() => localStorage.getItem('sort-brand') || '');
  const [rating, setRating] = useState(() => localStorage.getItem('rating-brand') || '');
  const [discount, setDiscount] = useState(() => localStorage.getItem('discount-brand') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSortChange = (value) => {
    setSort(value);
    localStorage.setItem('sort-brand', value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
    localStorage.setItem('rating-brand', value);
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    localStorage.setItem('discount-brand', value);
  };

  const handleGridChange = (value) => {
    setGrid(value);
    localStorage.setItem('grid-brand', value.toString());
  };

  const resetFilters = () => {
    setSort("");
    setRating("");
    setDiscount("");
    setKeyword("");
    localStorage.removeItem('sort-brand');
    localStorage.removeItem('rating-brand');
    localStorage.removeItem('discount-brand');
  };

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/${slug}`);
        setBrand(response.data.brand);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching brand :", err);
        setLoading(false);
      }
    };
    fetchBrand();
  }, [slug]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_HOST_URI}/api/v1/product/productsByBrand/${slug}`,
          {
            params: {
              keyword,
              sort,
              rating,
              discount,
            },
          }
        );
        setProducts(response.data.products);
        setLoading(false);
        setSearchQuery("");
      } catch (err) {
        console.error("Error fetching Products :", err);
        setLoading(false);
        setSearchQuery("");
      }
    };

    fetchProduct();
  }, [slug, keyword, sort, rating, discount]);

  const handleSearch = () => {
    if (searchQuery.length === 0) {
      toast.error("Please enter a valid input");
    } else {
      setKeyword(searchQuery);
    }
  };

  return (
    <div className="mx-5">
       <Helmet>
        <title>Zapster.com | {slug}</title>
      </Helmet>
     <div className="relative flex flex-wrap items-center justify-center gap-2 font-semibold pt-6 text-lg ">
          <span>Let's Explore </span>
          <img
            src={brand.image}
            alt={brand.name}
            className="w-44 object-cover"
          />
          <span>Products</span>

          <div className="md:absolute right-14 bottom-3 mb-2">
            <div className="relative">
              <input
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 py-2 pr-10 pl-4 text-sm text-gray-700 bg-white border border-gray-400 shadow-md rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                placeholder="Search products here..."
              />
              <button onClick={handleSearch}>
                <CiSearch className="absolute bg-white right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg hover:text-black" />
              </button>
            </div>
          </div>
        </div>
      <div className="border-b flex flex-wrap justify-between border-gray-400 md:px-6 pt-3">
        <Breadcrumb
          name={brand.name}
          navTo={"/all-brands"}
          TypeName={"Brands"}
        />

        <div className="flex flex-wrap gap-4 items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Total Products: ({products.length}) |
          </span>
          <button
            onClick={() => handleGridChange(2)}
            className={`p-3 rounded-full shadow-lg hover:bg-C hover:text-white ${
              grid === 2 ? 'bg-C text-white' : 'bg-white'
            }`}
          >
            <BsGrid size={18} />
          </button>
          <button
            onClick={() => handleGridChange(3)}
            className={`hidden md:block p-3 rounded-full shadow-lg hover:bg-C hover:text-white ${
              grid === 3 ? 'bg-C text-white' : 'bg-white'
            }`}
          >
            <BsGrid3X3 size={18} />
          </button>
          <button
            onClick={() => handleGridChange(4)}
            className={` p-3 rounded-full shadow-lg hover:bg-C hover:text-white ${
              grid === 4 ? 'bg-C text-white' : 'bg-white'
            }`}
          >
            <BsListUl size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          {keyword && (
            <p className="text-center mt-5 text-lg">{`Here are the results for "${keyword}" in "${brand.name}"`}</p>
          )}
          <div className="md:flex mt-3">
            {/* Mobile Filter Dropdown */}
            <div className="md:hidden w-full mb-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-C"
              >
                Filters
                {isFilterOpen ? <BsChevronUp size={20} /> : <BsChevronDown size={20} />}
              </button>
              {isFilterOpen && (
                <div className="mt-2 p-4 border rounded-md shadow-sm bg-white">
                  <FilterBar
                    handleSortChange={handleSortChange}
                    handleRatingChange={handleRatingChange}
                    handleDiscountChange={handleDiscountChange}
                    resetFilters={resetFilters}
                    sort={sort}
                    rating={rating}
                    discount={discount}
                  />
                </div>
              )}
            </div>

            {/* Desktop Filter Bar */}
            <div className="hidden md:block">
              <FilterBar
                handleSortChange={handleSortChange}
                handleRatingChange={handleRatingChange}
                handleDiscountChange={handleDiscountChange}
                resetFilters={resetFilters}
                sort={sort}
                rating={rating}
                discount={discount}
              />
            </div>

            <div
              className={`grid gap-3 md:mx-8 my-5 h-fit ${
                grid === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : grid === 3
                  ? 'grid-cols-2 md:grid-cols-3'
                  : 'grid-cols-2 md:grid-cols-4'
              }`}
            >
              {products.length === 0 ? (
                <OopsNotFound
                  content="No Products Found"
                  overRideCSS="w-[70vw]"
                />
              ) : (
                products?.map((product) => (
                  <ProductCard product={product} key={product._id} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShopByBrand;