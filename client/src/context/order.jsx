
import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const useOrder = () => {
  return useContext(OrderContext);
};

export const OrderProvider = ({ children }) => {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const placeOrder = () => {
    setIsOrderPlaced(true);  
  };

  const resetOrder = () => {
    setIsOrderPlaced(false);  
  };

  return (
    <OrderContext.Provider value={{ isOrderPlaced, placeOrder, resetOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
