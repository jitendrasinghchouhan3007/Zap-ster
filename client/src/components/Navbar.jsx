import React, { useState, useEffect } from "react";
import { ImSpinner2 } from "react-icons/im";
import {
  FaHeadset,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaCaretDown,
  FaSignOutAlt,
  FaShieldAlt,
  FaBox,
  FaSearch
} from "react-icons/fa";
import {
  RiHome2Line,
  RiStore2Line,
} from "react-icons/ri";
import { TbMail } from "react-icons/tb";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useSearch } from "../context/search";
import { useWishlist } from "../context/wishlist";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const [auth, setAuth] = useAuth();
  const [values, setValues] = useSearch();
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { wishlistItems } = useWishlist();
  const { cartItems } = useCart();

  useEffect(() => {
    const fetchNavCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories`);
        setCategories(data.categories || []);
      } catch (err) {
        // Fallback default categories
        setCategories([
          { _id: 'c1', name: 'Mobiles', slug: 'mobiles' },
          { _id: 'c2', name: 'Laptops', slug: 'Laptops' },
          { _id: 'c3', name: 'Electronics', slug: 'Electronics' },
          { _id: 'c4', name: 'Wearables', slug: 'Wearables' },
          { _id: 'c5', name: 'Accessories', slug: 'Accessories' }
        ]);
      }
    };
    fetchNavCategories();
  }, []);

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("auth");
    toast.success("Logout Successful");
    setDropdownOpen(false);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.keyword || !values.keyword.trim()) {
      toast.error("Please enter a search keyword");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data.products, query: values.keyword, keyword: '' });
      setLoading(false);
      navigate("/search");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Upper Top Bar */}
      <div className="flex items-center justify-between px-6 py-1.5 text-xs text-gray-300 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-6">
          <a href="tel:18005550199" className="flex items-center gap-1.5 hover:text-blue-400 transition">
            <FaHeadset className="text-blue-400" size={13} />
            <span className="hidden sm:inline">+1 (800) 555-0199</span>
          </a>
          <a href="mailto:support@zapster.com" className="flex items-center gap-1.5 hover:text-blue-400 transition">
            <TbMail className="text-blue-400" size={14} />
            <span className="hidden sm:inline">support@zapster.com</span>
          </a>
        </div>

        <div className="flex items-center gap-5 text-xs">
          <Link to="/all-categories" className="hover:text-blue-400 transition">All Categories</Link>
          <Link to="/all-brands" className="hover:text-blue-400 transition">Brands</Link>
          {auth?.user && (
            <Link to="/my-orders" className="hover:text-blue-400 transition flex items-center gap-1">
              <FaBox size={11} /> My Orders
            </Link>
          )}
          {auth?.user?.role === "ADMIN" && (
            <Link to="/manage-products" className="text-yellow-400 font-semibold hover:underline flex items-center gap-1">
              <FaShieldAlt size={11} /> Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Main Brand & Search Bar */}
      <div className="flex flex-wrap items-center justify-between px-6 py-3.5 bg-slate-800 text-white border-b border-slate-700">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-2xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent font-extrabold">Zap</span>
          <span className="text-white">ster</span>
        </Link>

        {/* Dynamic Search Input */}
        <div className="my-2 md:my-0 flex-1 max-w-lg mx-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
              className="w-full pl-4 pr-24 py-2 text-sm text-slate-900 bg-white rounded-full outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
              value={values.keyword}
              onChange={(e) => setValues({ ...values, keyword: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? <ImSpinner2 className="animate-spin" size={14} /> : <><FaSearch size={12} /> Search</>}
            </button>
          </form>
        </div>

        {/* User Account & Cart Cluster */}
        <div className="flex items-center gap-5 text-sm">
          {/* Wishlist */}
          <Link to="/wishlist" className="relative flex items-center gap-1.5 text-gray-200 hover:text-white transition">
            <div className="relative">
              <FaHeart size={20} className="text-red-400" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-xs font-medium">Wishlist</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center gap-1.5 text-gray-200 hover:text-white transition">
            <div className="relative">
              <FaShoppingCart size={20} className="text-blue-400" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline text-xs font-medium">Cart</span>
          </Link>

          {/* User Account Menu */}
          {auth?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full transition border border-slate-600 text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {auth.user.fullname ? auth.user.fullname.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">
                  {auth.user.fullname ? auth.user.fullname.split(" ")[0] : "User"}
                </span>
                <FaCaretDown />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{auth.user.fullname}</p>
                    <p className="text-[11px] text-slate-500 truncate">{auth.user.email}</p>
                  </div>

                  {auth.user.role === "ADMIN" && (
                    <Link
                      to="/manage-products"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaShieldAlt size={12} /> Admin Management
                    </Link>
                  )}

                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaBox size={12} /> My Orders
                  </Link>

                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaUser size={12} /> My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition border-t border-slate-100"
                  >
                    <FaSignOutAlt size={12} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold transition shadow"
            >
              <FaUser size={12} /> Login / Sign Up
            </Link>
          )}
        </div>
      </div>

      {/* Dynamic Category Navigation Bar */}
      <nav className="flex items-center gap-1 sm:gap-4 px-6 py-2 bg-slate-900 text-slate-200 text-xs font-medium overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-slate-800">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
              isActive ? "bg-blue-600 text-white font-semibold" : "hover:text-blue-400 hover:bg-slate-800"
            }`
          }
        >
          <RiHome2Line size={15} /> Home
        </NavLink>

        <NavLink
          to="/store"
          className={({ isActive }) =>
            `flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
              isActive ? "bg-blue-600 text-white font-semibold" : "hover:text-blue-400 hover:bg-slate-800"
            }`
          }
        >
          <RiStore2Line size={15} /> Store (All Products)
        </NavLink>

        <span className="text-slate-700">|</span>

        {/* Dynamic Category Links */}
        {categories.map((cat) => (
          <NavLink
            key={cat._id}
            to={`/category/${cat.slug || cat.name}`}
            className={({ isActive }) =>
              `px-3 py-1 rounded-md transition capitalize ${
                isActive ? "bg-blue-600 text-white font-semibold" : "hover:text-blue-400 hover:bg-slate-800"
              }`
            }
          >
            {cat.name}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
