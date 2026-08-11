import React, { useState } from "react";
import { useCart } from "../../context/cart";
import OopsNotFound from "../../components/OopsNotFound";
import renderRatingStars from "../../components/RenderRatingStars";
import { useNavigate } from "react-router-dom";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdOutlineDeleteForever } from "react-icons/md";
import { toast } from "react-hot-toast";
import { TbShoppingCartOff } from "react-icons/tb";
import { useOrder } from "../../context/order";
import { Helmet } from "react-helmet";

const Cart = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrder();
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [removingProductId, setRemovingProductId] = useState(null);

  const formatPrice = (price) => {
    return price.toLocaleString("en-IN");
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, product) => {
      return total + product.discountPrice;
    }, 0);
  };

  const calculateTotalSavings = () => {
    return cartItems.reduce((total, product) => {
      const savings = product.originalPrice - product.discountPrice;
      return total + savings;
    }, 0);
  };

  const handleRemoveFromCart = async (productId) => {
    setRemovingProductId(productId);
    try {
      await removeFromCart(productId);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
      console.error(error);
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Your cart is now empty!");
  };

  const handlePlaceOrder = () => {
    placeOrder();
    navigate("/checkout");
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
       <Helmet>
        <title>Zapster.com | My Cart</title>
      </Helmet>
        <div>
          <OopsNotFound
            content="Your cart is empty."
            overRideCSS="mt-14 mb-5 text-xl"
          />
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="mb-14 bg-C px-20 hover:bg-yellow-500 font-bold text-xl py-3 rounded-lg"
            >
              Shop Now
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 m-4">
        <div className="bg-white shadow-lg border w-full lg:w-[70%]">
          <h1 className="text-center text-2xl lg:text-3xl py-2 font-semibold border-b shadow-sm mx-5 sticky top-0 bg-white">
            Shopping Cart ({cartItems.length})
          </h1>
          <ul>
            {cartItems.map((product) => (
              <li
                key={product._id}
                className="px-4 pt-4 m-2 border shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-3 border-b">
                  <img
                    src={product.images[0]}
                    onClick={() => navigate(`/product/${product.slug}`)}
                    alt={product.name}
                    className="w-full sm:w-48 object-contain cursor-pointer"
                  />
                  <div className="py-4 flex-shrink-0">
                    <p
                      className="md:text-lg cursor-pointer hover:text-blue-600 text-C"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      <span className="hover:text-blue-600 mr-1 font-bold">
                        {product.brand.name}
                      </span>
                      <span className="text-black hover:text-blue-600 font-serif">
                        {product.name}
                      </span>
                    </p>

                    <div className="flex items-center my-2">
                      {renderRatingStars(product.ratings.averageRating)}
                      <span className="text-gray-500">
                        ({product.ratings.averageRating})
                      </span>
                    </div>

                    <p className="font-semibold text-red-600">
                      {product.discount}% OFF
                    </p>

                    <p>
                      <span className="line-through text-gray-500 mr-2">
                        ₹{formatPrice(product.originalPrice)}
                      </span>
                      <span className="font-semibold text-green-600">
                        ₹{formatPrice(product.discountPrice)}
                      </span>
                    </p>
                    {product.discountPrice > 500 ? (
                      <span className="text-sm text-gray-500">
                        Eligible for FREE Shipping
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center justify-center py-2">
                  <button
                    disabled={removingProductId === product._id}
                    className="flex items-center gap-1 font-semibold bg-red-500 justify-center text-white px-4 py-2 rounded-md hover:bg-red-800 disabled:bg-gray-500 disabled:hover:bg-gray-500"
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    {removingProductId === product._id ? (
                      "Please wait..."
                    ) : (
                      <>
                        <MdOutlineDeleteForever size={22} /> Remove
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full lg:w-[30%] sticky top-2 self-start">
          <div className="bg-white shadow-lg border p-4 rounded-lg">
            <h1 className="text-xl font-semibold text-gray-600 mb-3">
              PRICE DETAILS
            </h1>
            <hr className="mb-3" />
            <table className="w-full text-sm">
              <tbody>
                <tr className="text-lg">
                  <td className="py-2 text-gray-500">
                    Original Price ({cartItems.length} {" "}
                    {cartItems.length !== 1 ? "items" : "item"})
                  </td>
                  <td className="text-right py-2 text-gray-500">
                    ₹
                    {formatPrice(
                      calculateTotalPrice() + calculateTotalSavings()
                    )}
                  </td>
                </tr>
                <tr className="text-lg">
                  <td className="py-2 text-gray-500">Discount</td>
                  <td className="text-right py-2 text-green-600">
                    -₹{formatPrice(calculateTotalSavings())}
                  </td>
                </tr>
                <tr className="text-lg">
                  <td className="py-2 text-gray-500">Delivery Charges</td>
                  <td className="text-right py-2 text-green-600">
                    <span className="text-sm text-gray-400 line-through">
                      ₹50
                    </span>{" "}
                    FREE
                  </td>
                </tr>
                <tr className="text-lg">
                  <td className="py-2 text-gray-500">Price After Discount</td>
                  <td className="text-right py-2 text-gray-500">
                    ₹{formatPrice(calculateTotalPrice())}
                  </td>
                </tr>

                <tr className="border-y font-bold text-2xl text-gray-800">
                  <td className="py-3">Total Payable</td>
                  <td className="text-right py-3">
                    ₹{formatPrice(calculateTotalPrice())}
                  </td>
                </tr>
              </tbody>
            </table>
            <span className="block my-4 text-green-600 font-semibold text-center">
              You will save ₹{formatPrice(calculateTotalSavings())} on this
              order.
            </span>
          </div>
          <div className="flex justify-center gap-2 py-5 text-gray-700">
            <IoShieldCheckmarkSharp size={28} />
            <span className="text-lg font-semibold">
              100% Safe and Secure Payments
            </span>
          </div>
          <div className="text-3xl font-bold text-center">
            
            <sub className="text-sm text-blue-400">{"{PAYMENTS}"}</sub>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 m-4 sticky bottom-0">
        <div className="flex justify-end items-center gap-4 self-end bg-white w-full lg:w-[69%] p-5 border shadow-sm">
          <button
            className="flex items-center gap-2 text-gray-400 hover:text-blue-600"
            onClick={handleClearCart}
          >
            <span>Empty Cart</span>
            <TbShoppingCartOff size={19} />
          </button>
          <span>|</span>
          <button
            className="bg-orange-600 font-bold text-white rounded px-14 py-4"
            onClick={handlePlaceOrder}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
