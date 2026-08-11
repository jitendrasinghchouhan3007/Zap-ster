import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaTruck } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useOrder } from "../context/order";
import { Helmet } from "react-helmet";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);
  const { resetOrder } = useOrder();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [auth] = useAuth();
  const {  clearCart } = useCart();

  useEffect(() => {
    const confirmOrder = async () => {
      const searchParams = new URLSearchParams(location.search);
      const sessionId = searchParams.get("session_id");

      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post(
         `${import.meta.env.VITE_HOST_URI}/api/v1/product/confirm-order?session_id=${sessionId}`,
          {
            headers: { Authorization: auth.token },
          }
        );
        
        setOrder(response.data.order);
        clearCart();
        resetOrder();
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    confirmOrder();
  }, [location]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/cart")}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-4 sm:px-6 lg:px-8">
        <Helmet>
        <title>Zapster.com | Success</title>
      </Helmet>
      <div className=" mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-500 px-4 py-8 text-center">
            <FaCheckCircle className="text-white text-6xl mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Order Confirmed!</h1>
          </div>
          <div className="p-8">
            <p className="text-gray-700 text-lg mb-6">
              Thank you for your purchase. Your order has been successfully
              placed and is being processed.
            </p>
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Number:</p>
                  <p className="font-medium">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount:</p>
                  <p className="font-medium">₹{order.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method:</p>
                  <p className="font-medium">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status:</p>
                  <p className="font-medium">{order.paymentStatus}</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={() => navigate("/my-orders")}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
              >
                <FaShoppingBag className="mr-2" />
                View My Orders
              </button>
              <div className="flex items-center text-green-500">
                <FaTruck className="mr-2" />
                <span>
                  Estimated Delivery:{" "}
                  {new Date(order.deliveredAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
