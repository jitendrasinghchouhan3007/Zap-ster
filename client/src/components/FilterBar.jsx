import React from "react";

const FilterBar = ({
  handleSortChange,
  handleRatingChange,
  handleDiscountChange,
  sort,
  rating,
  discount,
  resetFilters,
}) => {
  return (
    <div className="my-4 ">
      <div className="w-60 sticky top-[5rem]  ">
        <h2 className="text-xl font-semibold pb-2  ">Filters</h2>
        <hr />
        {handleSortChange ? (
          <div className="mb-3">
            <p className="block font-medium pb-2"> Sort By </p>
            <div className="space-y-2 px-5 text-sm">
              {[
                { value: "priceLowToHigh", label: "Price Low to High" },
                { value: "priceHighToLow", label: "Price High to Low" },
                { value: "latest", label: "Newest" },
              ].map((sortOption) => (
                <label
                  key={sortOption.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    name="sortOption"
                    className="form-radio text-C"
                    checked={sort === sortOption.value}
                    onChange={() => handleSortChange(sortOption.value)}
                  />
                  <span>{sortOption.label}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mb-3">
          <p className="block font-medium pb-2"> Rating </p>
          <div className="space-y-2 px-5 text-sm">
            {[
              { value: "1", label: "1 star & above" },
              { value: "2", label: "2 star & above" },
              { value: "3", label: "3 star & above" },
              { value: "4", label: "4 star & above" },
            ].map((ratingOption) => (
              <label
                key={ratingOption.value}
                className="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="ratingOption"
                  className="form-radio text-C"
                  checked={rating === ratingOption.value}
                  onChange={() => handleRatingChange(ratingOption.value)}
                />
                <span>{ratingOption.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <p className="block font-medium pb-2"> Discount</p>
          <div className="space-y-2 px-5 text-sm">
            {[
              { value: "10", label: "10% or more" },
              { value: "20", label: "20% or more" },
              { value: "30", label: "30% or more" },
              { value: "40", label: "40% or more" },
              { value: "50", label: "50% or more" },
            ].map((discountOption) => (
              <label
                key={discountOption.value}
                className="flex items-center space-x-2"
              >
                <input
                  type="radio"
                  name="discountOption"
                  className="form-radio text-C"
                  checked={discount === discountOption.value}
                  onChange={() => handleDiscountChange(discountOption.value)}
                />
                <span>{discountOption.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={resetFilters}
          className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
