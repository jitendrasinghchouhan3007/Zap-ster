import React, { useEffect, useState } from "react";
import axios from "axios";
import{toast}from "react-hot-toast"
import { MdOutlinePayments, MdLocalShipping } from "react-icons/md";
import { Helmet } from "react-helmet";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const updateOrderStatus = async (id, paymentStatus, orderStatus) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_HOST_URI}/api/v1/order/update-order/${id}`, {
        paymentStatus,
        orderStatus,
      });
      toast.success("Order updated successfully");
    } catch (err) {
      toast.error(`Failed to update order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/order/all-orders`);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty deps: only fetch on mount; updateOrderStatus does not trigger refetch

 
  if (error)
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded border shadow p-5 min-h-screen">
        <Helmet>
        <title>Zapster.com |Admin-All Orders</title>
      </Helmet>
     <h1 className="text-xl font-bold mb-6">All Orders</h1>
      <div className="flex flex-col gap-5">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg p-6 shadow bg-white "
          >
            <div>
              <div className="flex items-center justify-between">
                <p className="font-bold mb-2">
                  Order-ID :{" "}
                  <span className="text-sm font-semibold">{order._id}</span>
                </p>
                <p className="font-bold mb-2">
                  Mode :{" "}
                  <span className="text-sm font-semibold">
                    {order.paymentMethod}
                  </span>
                </p>
              </div>
              <hr />
              <div className="flex flex-col md:flex-row items-center gap-5">
                <div className="flex items-center my-3">
                  <div className="font-bold w-fit ">Buyer Info :</div>
                  <div className="flex ml-3 gap-5 border pr-8 py-2 pl-2 rounded-lg shadow bg-gray-100">
                    <div>
                      <img
                        src={order.user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 object-cover rounded-full "
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold">{order.user.email}</p>
                      <p>{order.user.fullname}</p>
                    </div>
                  </div>
                </div>

                <div className=" md:border-l my-4 px-8 ">
                  <table className="w-fit bg-white text-sm">
                    <tbody>
                      <tr className="bg-white">
                        <th className="py-2 px-4 border text-left">Total</th>
                        <td className="py-2 px-4 border">
                          ₹{order.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th className="py-2 px-4 border text-left">
                          Order Date
                        </th>
                        <td className="py-2 px-4 border">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th className="py-2 px-4 border text-left">
                          Delivery Date
                        </th>
                        <td className="py-2 px-4 border">
                          {new Date(order.deliveredAt).toLocaleDateString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <hr />
            <div className="my-4 flex md:flex-row flex-col  md:justify-between">
            <div>
            <h3 className="font-bold mb-2">Items:</h3>
              <div className=" md:w-[26rem] overflow-x-scroll custom-scrollbar flex gap-2 ">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center flex-shrink-0 border rounded-lg px-4  py-2 mb-2"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 rounded mr-4"
                    />
                    <div>
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                
              </div>
            </div>

            <div className="md:mx-6 w-full">
              
            <div className="mb-4 ">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MdOutlinePayments className="inline mr-2" /> Payment Status:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={order.paymentStatus}
                onChange={(e) =>
                  updateOrderStatus(
                    order._id,
                    e.target.value,
                    order.orderStatus
                  )
                }
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MdLocalShipping className="inline mr-2" /> Order Status:
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={order.orderStatus}
                onChange={(e) =>
                  updateOrderStatus(
                    order._id,
                    order.paymentStatus,
                    e.target.value
                  )
                }
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            </div>
            </div>

           <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
