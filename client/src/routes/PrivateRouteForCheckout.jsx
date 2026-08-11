import React from "react";
import { Navigate } from "react-router-dom";
import { useOrder } from "../context/order";

const PrivateRouteForCheckout = ({ children }) => {
  const { isOrderPlaced } = useOrder(); 

  if (!isOrderPlaced) {
    return <Navigate to="/" />;
  }

  return children;  
};

export default PrivateRouteForCheckout;
