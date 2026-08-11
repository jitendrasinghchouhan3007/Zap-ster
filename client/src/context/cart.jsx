import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./auth";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wait, setWait] = useState(false);
  const [auth] = useAuth();
  const [waitForAdd, setWaitForAdd] = useState(false);

  const getAuthHeader = () => ({
    Authorization: auth.token && auth.token.startsWith("Bearer ")
      ? auth.token
      : `Bearer ${auth.token}`,
  });

  // Fetch cart items
  const fetchCart = async () => {
    if (!auth?.token) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/cart`, {
        headers: getAuthHeader(),
      });
      setCartItems(data.products.reverse());
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cartItems.some((item) => item._id === productId || item.id === productId);
  };

  // Add to cart
  const addToCart = async (productId) => {
    try {
      setWaitForAdd(true);
      await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/addtocart/${productId}`,
        {},
        { headers: getAuthHeader() }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setWaitForAdd(false);
    }
  };

  // Remove from cart
  const removeFromCart = async (productId) => {
    try {
      setWait(true);
      await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/removetocart/${productId}`,
        {},
        { headers: getAuthHeader() }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setWait(false);
    }
  };

  // clear cart at once
  const clearCart = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/clear-cart`,
        {},
        { headers: getAuthHeader() }
      );
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setWait(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [auth?.token]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isInCart,
        fetchCart,
        addToCart,
        removeFromCart,
        clearCart,
        wait,
        waitForAdd,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
