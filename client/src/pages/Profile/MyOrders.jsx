import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaTruck, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import OopsNotFound from "../../components/OopsNotFound";
import Spinner from "../../components/Spinner";
import { Helmet } from "react-helmet";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/myOrders`, {
          headers: { Authorization: auth.token },
        });
        setOrders(response.data.myOrders.reverse());
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center ">
        <Spinner />
      </div>
    );
  }


  return (
    <div className="bg-white border shadow-md rounded p-5 min-h-96">
        <Helmet>
        <title>Zapster.com | My Orders</title>
      </Helmet>
      <h1 className="text-xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <OopsNotFound
          content={" You haven't placed any orders yet."}
          overRideCSS={"m-40"}
        />
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">
                  Order #{order._id.slice(-6)}
                </span>
                <div className="flex flex-col justify-center">
                  {" "}
                  <div
                    className={`px-3 w-full py-1 rounded-full text-sm text-center ${
                      order.orderStatus === "Processing"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {order.orderStatus}
                  </div>
                  <div className="text-sm">
                    {" "}
                    Delivered At :
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center mb-4 ">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    onClick={() => {
                      navigate(`/product/${item.product.slug}`);
                    }}
                    className="w-20 h-20 object-cover rounded-md mr-4 cursor-pointer"
                  />
                  <div>
                    <h3
                      className="font-semibold hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        navigate(`/product/${item.product.slug}`);
                      }}
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-green-600">
                      <span className="text-gray-600"> Price: </span>₹
                      {item.product.discountPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center text-gray-600">
                    <FaMoneyBillWave className="mr-2" /> Payment Method:
                  </span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center text-gray-600">
                    <FaTruck className="mr-2" /> Payment Status:
                  </span>
                  <span>{order.paymentStatus}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center text-gray-600">
                    <FaBox className="mr-2" /> Total Price:
                  </span>
                  <span className="font-semibold">
                    ₹{order.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" /> Order Date:
                  </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
