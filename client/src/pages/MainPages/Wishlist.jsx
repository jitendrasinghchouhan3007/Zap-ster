import React from "react";
import { useWishlist } from "../../context/wishlist";
import OopsNotFound from "../../components/OopsNotFound";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";

const Wishlist = () => {
  const { wishlistItems, clearWishlist } = useWishlist();

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success("Your WishList  is now empty!");
  };

  return (
    <>
      <Helmet>
        <title>Zapster.com | My Wishlist</title>
      </Helmet>
      <div className="flex items-center justify-between  mx-6  border-b">
        <h1
          className={`text-3xl font-bold  py-4 w-full ${
            wishlistItems.length ? null : "text-center"
          }`}
        >
          My Wishlist ({wishlistItems.length})
        </h1>
        {wishlistItems.length ? (
          <button
            onClick={handleClearWishlist}
            className=" w-28 font-bold text-red-700 hover:text-red-500"
          >
            Remove All
          </button>
        ) : null}
      </div>
      {wishlistItems.length === 0 ? (
        <div className="m-14">
          <OopsNotFound content="No Product found in Your Wishlist !! Hurry Up Add Products in your wishlist " />
        </div>
      ) : (
        <div className="grid md:grid-cols-4 grid-cols-2  md:gap-5  gap-4 px-4  md:px-10 py-5 ">
          {wishlistItems.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      )}
    </>
  );
};

export default Wishlist;
