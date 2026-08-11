import React from "react";
import OopsNotFound from "../OopsNotFound";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";

const SimilarProducts = ({ relatedProducts, loading }) => {
  const navigate = useNavigate();

  const handleClick = (slug) => {
    navigate(`/product/${slug}`);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="md:px-8 px-3 md:mt-14 my-6 ">
        <div className="border shadow pb-5  bg-white">
          {loading ? (
            <Spinner />
          ) : (
            <>
              <h2 className="md:text-2xl text-lg font-bold  bg-white px-6 py-5 text-gray-900">
                Similar Products
              </h2>
              <div className="md:px-14 px-5 ">
                {relatedProducts.length < 1 && (
                  <OopsNotFound content="No Similar Products Found" />
                )}
                <div className=" flex overflow-x-scroll custom-scrollbar py-3">
                  {relatedProducts?.map((product) => (
                    <div
                      onClick={() => handleClick(product.slug)}
                      className="pr-[1.1rem]  flex-shrink-0 "
                      key={product._id}
                    >
                      <div className="text-center text-sm border  border-gray-300 shadow rounded-md overflow-hidden transition-transform transform  hover:scale-95 cursor-pointer">
                        <img
                          src={product.images[0]}
                          alt={product.slug}
                          className="md:w-[12.5rem] w-[8rem] "
                        />
                        <span className="text-C">{product.brand.name} </span>
                        <h3 className="text-black font-serif">
                          {product.name}
                        </h3>
                        <p className="pb-2">
                          <span className="font-semibold">
                            ₹{product.discountPrice.toLocaleString("en-IN")}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SimilarProducts;
