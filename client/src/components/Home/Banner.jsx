import React from "react";
import {
  FaTruck,
  FaGift,
  FaHeadset,
  FaMoneyBill,
  FaLock,
} from "react-icons/fa";

const Banner = () => {
  return (
    <div className="flex flex-wrap md:justify-between justify-center gap-5 items-center px-12 py-6 bg-gray-200 text-gray-900">
      <div className=" text-center">
        <div className="flex justify-center">
          <FaTruck size={45} />
        </div>
        <h3 className="font-semibold">Free Shipping</h3>
        <p className="text-sm">From all orders over ₹500</p>
      </div>

      <div className=" text-center">
        <div className="flex justify-center">
          <FaGift size={45} />
        </div>
        <h3 className="font-semibold">Daily Surprise Offers</h3>
        <p className="text-sm">Save up to 25% off</p>
      </div>

      <div className=" text-center">
        <div className="flex justify-center">
          <FaHeadset size={45} />
        </div>
        <h3 className="font-semibold">Support 24x7</h3>
        <p className="text-sm">Shop with an expert</p>
      </div>

      <div className=" text-center">
        <div className="flex justify-center">
          <FaMoneyBill size={45} />
        </div>
        <h3 className="font-semibold">Affordable Prices</h3>
        <p className="text-sm">Get Factory direct price</p>
      </div>

      <div className=" text-center">
        <div className="flex justify-center">
          <FaLock size={45} />
        </div>
        <h3 className="font-semibold">Secure Payments</h3>
        <p className="text-sm">100% Protected Payments</p>
      </div>
    </div>
  );
};

export default Banner;
