import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "./auth";

const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [auth] = useAuth();

  const getAuthHeader = () => ({
    Authorization: auth.token && auth.token.startsWith("Bearer ")
      ? auth.token
      : `Bearer ${auth.token}`,
  });

  // Fetch wishlist items
  const fetchWishlist = async () => {
    if (!auth?.token) return;
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/wishlist`, {
        headers: getAuthHeader(),
      });
      setWishlistItems(data.products);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId || item.id === productId);
  };

  // clear wishlist at once
  const clearWishlist = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/clear-wishlist`,
        {},
        { headers: getAuthHeader() }
      );
      fetchWishlist();
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [auth?.token]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, isInWishlist, fetchWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

// Custom hook
const useWishlist = () => useContext(WishlistContext);

export { useWishlist, WishlistProvider };