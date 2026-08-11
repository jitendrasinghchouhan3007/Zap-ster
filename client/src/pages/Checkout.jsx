import React, { useState, useEffect } from "react";
import { useNavigate , useLocation } from "react-router-dom";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useOrder } from "../context/order";
import axios from "axios";
import toast from "react-hot-toast";
import OopsNotFound from "../components/OopsNotFound";
import { FaPlus } from "react-icons/fa6";
import renderRatingStars from "../components/RenderRatingStars";
import {loadStripe} from '@stripe/stripe-js';
import { Helmet } from "react-helmet";


const Checkout = () => {
  const { resetOrder,placeOrder } = useOrder();
  const [loading,setLoading]= useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const { cartItems, clearCart } = useCart();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchCheckoutInfo = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/checkout`, {
        headers: { Authorization: auth.token },
      });
      setAddresses(data.addresses);
    } catch (error) {
      console.error("Error fetching checkout info:", error);
    }
  };

  const handleUseThisAddress = () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }
    setIsAddressSelected(true);
    setShowOrderSummary(true);
  };

  useEffect(() => {
    fetchCheckoutInfo();
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [location]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          price: item.discountPrice,
          quantity:1
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        itemsPrice: calculateTotalPrice(),
        shippingPrice: 0,
        totalPrice: calculateTotalPrice(),
      };

      if (paymentMethod === "Cash on Delivery") {
           
        setLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_HOST_URI}/api/v1/product/create-order`,
          orderData,
          {
            headers: { Authorization: auth.token }
          }
        );
        
        if (data.success) {
         
          clearCart();
          resetOrder();
          setLoading(false);
          toast.success("Order Placed Successfully");
          navigate("/my-orders");
        }
      } else if (paymentMethod === "Online") {
        placeOrder();  
        setLoading(true);
        const { data } = await axios.post(
          `${import.meta.env.VITE_HOST_URI}/api/v1/product/create-order`,
          orderData,
          {
            headers: { Authorization: auth.token }
          }
        );
        if (data.success) {
         
          const stripe = await loadStripe("pk_test_51Q6mkbDF2PpyfZVVt4A8gxnL9RIB7gDkQT67j1zfKqgSMR4CVjIJaNzvqba4U33WLdmhY1zqzBDagRiPnCb47Euk00VzII1rfG");
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          });
          setLoading(false);

          if (error) {
            console.error("Stripe checkout error:", error);
            toast.error("Failed to redirect to Stripe checkout");
          }
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }finally{
      setLoading(false);
    }
  };
     

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

  return (
    <div className="flex flex-col md:flex-row gap-8 m-4 ">
        <Helmet>
        <title>Zapster.com | Checkout</title>
      </Helmet>

      <div className="w-full md:w-[70%] bg-white shadow-lg border rounded-lg overflow-hidden ">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

          {/* Shipping Address Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 shadow-sm text-gray-700">
              Shipping Address
            </h2>
            {isAddressSelected ? (
              <div className="p-4 bg-gray-100 rounded-lg shadow-inner transition-all duration-300 ease-in-out">
                <p className="font-semibold">{selectedAddress.name}</p>
                <p>{selectedAddress.phoneNumber}</p>
                <p>
                  {selectedAddress.street}, {selectedAddress.locality},{" "}
                  {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.postalCode}
                </p>
              </div>
            ) : (
              <>
                {addresses.length !== 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`border shadow-sm p-5 rounded-lg relative transition-all duration-300 ease-in-out ${
                          selectedAddress === address
                            ? "bg-blue-50 border-blue-300"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          id={address._id}
                          name="address"
                          value={address._id}
                          onChange={() => setSelectedAddress(address)}
                          className="absolute top-4 right-4"
                        />
                        <label
                          htmlFor={address._id}
                          className="block cursor-pointer"
                        >
                          <div className="bg-gray-200 text-xs font-semibold text-gray-600 px-3 py-1 rounded inline-block mb-2">
                            {address.addressType.toUpperCase()}
                          </div>
                          <p className="font-semibold">{address.name}</p>
                          <p className="text-sm">{address.phoneNumber}</p>
                          <p className="text-sm text-gray-700">
                            {address.street}, {address.locality}, {address.city}
                            , {address.state} -{" "}
                            <span className="font-semibold text-black">
                              {address.postalCode}
                            </span>
                          </p>
                        </label>
                        {selectedAddress === address && (
                          <button
                            onClick={handleUseThisAddress}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 mt-4 transform hover:scale-105"
                          >
                            Use This Address
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <OopsNotFound content={"No Address Found"} />
                )}

                <div
                  className="flex items-center justify-center cursor-pointer font-semibold text-blue-500 hover:text-blue-800 m-5 transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={() => navigate("/manage-addresses")}
                >
                  <FaPlus className="mr-2" /> Add New Address
                </div>
              </>
            )}
          </div>

          {/* Order Summary Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 shadow-sm text-gray-700">
              Order Details
            </h2>
            {isAddressSelected && showOrderSummary && (
              <ul className="space-y-4">
                {cartItems.map((product) => (
                  <li
                    key={product._id}
                    className="px-4 pt-4 m-2 border shadow-sm bg-white rounded-lg transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    <div className="flex gap-3 border-b pb-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-48 object-contain rounded-md"
                      />
                      <div className="py-4 flex-shrink-0">
                        <p className="md:text-lg">
                          <span className="text-blue-600 font-bold">
                            {product.brand.name}
                          </span>{" "}
                          <span className="text-black font-serif">
                            {product.name}
                          </span>
                        </p>
                        <p>Quantity: 1</p>
                        <div className="flex items-center my-2">
                          {renderRatingStars(
                            product.ratings.averageRating || 3.5
                          )}
                          <span className="text-gray-500 ml-2">
                            ({product.ratings.averageRating || 3.5})
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
                        {product.discountPrice > 500 && (
                          <span className="text-sm text-gray-500">
                            Eligible for FREE Shipping
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {isAddressSelected && !showPaymentMethod && (
              <button
                onClick={() => setShowPaymentMethod(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 mt-4 transform hover:scale-105"
              >
                Proceed to Payment
              </button>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2 shadow-sm text-gray-700">
              Payment Method
            </h2>
            {showPaymentMethod && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="online"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="online" className="text-lg">
                    Online Payment
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <label htmlFor="cod" className="text-lg">
                    Cash on Delivery
                  </label>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 mt-4 transform hover:scale-105 disabled:bg-gray-600 disabled:hover:bg-gray-600"
                >
                  {loading? " Please wait...": " Place Order"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full md:w-[30%] sticky top-2 self-start">
        <div className="bg-white shadow-lg p-6 rounded-lg border ">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">  Original Price ({cartItems.length}{" "}
                {cartItems.length !== 1 ? "items" : "item"})</span>
              <span className="font-semibold">
              ₹
                    {formatPrice(
                      calculateTotalPrice() + calculateTotalSavings()
                    )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-semibold  text-red-600 "> -₹{formatPrice(calculateTotalSavings())}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-semibold text-green-600">  <span className="text-sm text-gray-400 line-through">
                      ₹50
                    </span>{" "}
                    FREE</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Price After Discount</span>
              <span className="font-semibold text-lg">
                ₹{formatPrice(calculateTotalPrice())}
              </span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-bold text-lg">
              <span>Total Payable:</span>
              <span className="text-blue-600">
                ₹{formatPrice(calculateTotalPrice())}
              </span>
            </div>

            <span className="block my-4 text-green-600 font-semibold text-center">
              You will save ₹{formatPrice(calculateTotalSavings())} on this
              order.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;