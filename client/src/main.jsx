import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/auth.jsx";
import { WishlistProvider } from "./context/wishlist.jsx";
import { CartProvider } from "./context/cart.jsx";
import { OrderProvider } from "./context/order.jsx";
import { SearchProvider } from "./context/search.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <SearchProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <WishlistProvider>
              <App />
            </WishlistProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </SearchProvider>
  </QueryClientProvider>
);
