import React, { lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/MainPages/Home.jsx";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import AdminPanelLayout from "./layouts/AdminPanelLayout";
import IsAdmin from "./routes/IsAdmin";
import ManageProducts from "./pages/Admin/ManageProducts";
import MyProfile from "./pages/Profile/MyProfile";
import Spinner from "./components/Spinner";

const ManageBrand=lazy(() => import("./pages/Admin/ManageBrand.jsx"));
const ManageCategories=lazy(() => import("./pages/Admin/ManageCategories.jsx"));
const AllOrders =lazy(() => import("./pages/Admin/AllOrders.jsx"));
const AllAddresses = lazy(() => import("./pages/Profile/AllAddresses"));
const AllUsers = lazy(() => import("./pages/Admin/AllUsers"));
const MyOrders = lazy(() => import("./pages/Profile/MyOrders"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PrivateRouteForCheckout = lazy(() => import("./routes/PrivateRouteForCheckout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const Cart = lazy(() => import("./pages/MainPages/Cart"));
const Wishlist = lazy(() => import("./pages/MainPages/Wishlist"));
const OurStore = lazy(() => import("./pages/MainPages/OurStore"));
const ContactUs = lazy(() => import("./pages/MainPages/ContactUs"));
const AboutUs = lazy(() => import("./pages/MainPages/AboutUs"));
const PrivacyPolicy = lazy(() => import("./pages/MainPages/PrivacyPolicy"));
const ShippingPolicy = lazy(() => import("./pages/MainPages/ShippingPolicy"));
const TermsOfService = lazy(() => import("./pages/MainPages/TermsOfService"));
const DetailedProductPage = lazy(() => import("./pages/MainPages/DetailedProductPage"));
const ShopByCategory = lazy(() => import("./pages/MainPages/ShopByCategory"));
const ShopByBrand = lazy(() => import("./pages/MainPages/ShopByBrand"));
const AllBrands = lazy(() => import("./pages/MainPages/AllBrands"));
const AllCategories = lazy(() => import("./pages/MainPages/AllCategories"));
const Login = lazy(() => import("./pages/MainPages/Login"));
const CreateAnAccount = lazy(() => import("./pages/MainPages/CreateAnAccount"));
const ForgotPassword = lazy(() => import("./pages/MainPages/ForgotPassword"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Search = lazy(()=>import("./pages/MainPages/Search"));

const App = () => {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="store" element={<OurStore />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
              <Route path="shipping-policy" element={<ShippingPolicy />} />
              <Route path="terms-and-conditions" element={<TermsOfService />} />
              <Route path="product/:slug" element={<DetailedProductPage />} />
              <Route path="category/:slug" element={<ShopByCategory />} />
              <Route path="brand/:slug" element={<ShopByBrand />} />
              <Route path="all-brands" element={<AllBrands />} />
              <Route path="all-categories" element={<AllCategories />} />
              <Route path="search" element={<Search />} />
              <Route path="*" element={<PageNotFound />} />


              {/* Admin Routes */}
              <Route element={<IsAdmin />}>
                <Route element={<AdminPanelLayout />}>
                  <Route index element={<Navigate to={"manage-products"} />} />  
                  <Route path="all-users" element={<AllUsers />} />
                  <Route path="manage-products" element={<ManageProducts />} />
                  <Route path="manage-categories" element={<ManageCategories />} />
                  <Route path="manage-brands" element={<ManageBrand />} />
                  <Route path="all-orders" element={<AllOrders />} />
                </Route>
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<ProfileLayout />}>
                <Route index element={<Navigate to={"profile"} />} />
                  <Route path="profile" element={<MyProfile />} />
                  <Route path="manage-addresses" element={<AllAddresses />} />
                  <Route path="my-orders" element={<MyOrders />} />
                </Route>

                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <PrivateRouteForCheckout>
                      <Checkout />
                    </PrivateRouteForCheckout>
                  }
                />
                <Route path="confirm-order" element={<OrderConfirmation />} />
              </Route>
            </Route>

            {/* Authentication Routes */}
            <Route element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="register" element={<CreateAnAccount />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;