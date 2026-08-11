import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import axios from "axios";
import Spinner from "../../components/Spinner";
import OopsNotFound from "../../components/OopsNotFound";
import { BsGrid, BsGrid3X3, BsListUl ,BsChevronDown, BsChevronUp} from "react-icons/bs";
import ProductCard from "../../components/ProductCard";
import FilterBar from "../../components/FilterBar";
import { Helmet } from "react-helmet";

const ShopByCategory = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grid, setGrid] = useState(() => parseInt(localStorage.getItem('grid') || '4'));
  const [sort, setSort] = useState(() => localStorage.getItem('sort') || '');
  const [rating, setRating] = useState(() => localStorage.getItem('rating') || '');
  const [discount, setDiscount] = useState(() => localStorage.getItem('discount') || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSortChange = (value) => {
    setSort(value);
    localStorage.setItem('sort', value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
    localStorage.setItem('rating', value);
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    localStorage.setItem('discount', value);
  };

  const handleGridChange = (value) => {
    setGrid(value);
    localStorage.setItem('grid', value.toString());
  };

  const resetFilters = () => {
    setSort("");
    setRating("");
    setDiscount("");
    localStorage.removeItem('sort');
    localStorage.removeItem('rating');
    localStorage.removeItem('discount');
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_HOST_URI}/api/v1/product/productsByCategory/${slug}`,
          {
            params: {
              sort,
              rating,
              discount,
            },
          }
        );
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Products :", err);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, sort, rating, discount]);

  return (
    <div className="mx-5">
        <Helmet>
        <title>Zapster.com | {slug}</title>
      </Helmet>
      <h1 className="sticky top-0 shadow z-10 bg-white text-center md:text-3xl text-2xl border-b border-gray-400 p-3">
        Explore <span className="font-bold">{slug.toUpperCase()}</span>
      </h1>
      <div className="border-b flex flex-wrap justify-between border-gray-400 md:px-6 pt-3">
        <Breadcrumb
          name={slug}
          navTo={"/all-categories"}
          TypeName={"Categories"}
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

export default ShopByCategory;