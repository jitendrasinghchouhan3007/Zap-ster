import React, { useState, useEffect } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaHeadset, FaEnvelope, FaMapMarkerAlt, FaDatabase, FaShieldAlt } from "react-icons/fa";
import axios from "axios";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/category/all-categories`),
          axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/brand/all-brands`)
        ]);
        setCategories(catRes.data.categories || []);
        setBrands(brandRes.data.brands || []);
      } catch (err) {
        // Fallback default lists
        setCategories([
          { _id: '1', name: 'Mobiles', slug: 'mobiles' },
          { _id: '2', name: 'Laptops', slug: 'Laptops' },
          { _id: '3', name: 'Electronics', slug: 'Electronics' },
          { _id: '4', name: 'Wearables', slug: 'Wearables' },
          { _id: '5', name: 'Accessories', slug: 'Accessories' }
        ]);
        setBrands([
          { _id: 'b1', name: 'Apple', slug: 'Apple' },
          { _id: 'b2', name: 'Samsung', slug: 'Samsung' },
          { _id: 'b3', name: 'Sony', slug: 'Sony' },
          { _id: 'b4', name: 'Dell', slug: 'Dell' }
        ]);
      }
    };
    fetchFooterData();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-10 pb-6 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
        {/* Col 1: System Info & Contact */}
        <div>
          <div className="flex items-center gap-1.5 text-2xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-blue-500 to-indigo-400 bg-clip-text text-transparent font-extrabold">Zap</span>
            <span className="text-white">ster</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            E-Commerce Product & Order Management System.
          </p>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FaHeadset className="text-blue-400" />
              <span>Customer Support: +1 (800) 555-0199</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" />
              <span>Email: support@zapster.com</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" />
              <span>HQ: Tech Hub Center, CA</span>
            </div>
          </div>
        </div>

        {/* Col 2: Dynamic Categories */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 text-xs">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/category/${cat.slug || cat.name}`}
                  onClick={scrollToTop}
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  <MdKeyboardArrowRight className="text-blue-500" />
                  <span>{cat.name}</span>
                </Link>
              </li>
            ))}
            
          </ul>
        </div>

        {/* Col 3: Dynamic Top Brands */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Top Brands
          </h4>
          <ul className="space-y-2 text-xs">
            {brands.slice(0, 6).map((brand) => (
              <li key={brand._id}>
                <Link
                  to={`/brand/${brand.slug || brand.name}`}
                  onClick={scrollToTop}
                  className="flex items-center gap-1 hover:text-blue-400 transition"
                >
                  <MdKeyboardArrowRight className="text-blue-500" />
                  <span>{brand.name}</span>
                </Link>
              </li>
            ))}
           
          </ul>
        </div>

        {/* Col 4: Quick Account Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">
            Customer Quick Links
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/store" onClick={scrollToTop} className="flex items-center gap-1 hover:text-blue-400 transition">
                <MdKeyboardArrowRight className="text-blue-500" />
                <span>Our Store (All Products)</span>
              </Link>
            </li>
            <li>
              <Link to="/my-orders" onClick={scrollToTop} className="flex items-center gap-1 hover:text-blue-400 transition">
                <MdKeyboardArrowRight className="text-blue-500" />
                <span>Order History & Details</span>
              </Link>
            </li>
            <li>
              <Link to="/cart" onClick={scrollToTop} className="flex items-center gap-1 hover:text-blue-400 transition">
                <MdKeyboardArrowRight className="text-blue-500" />
                <span>Shopping Cart</span>
              </Link>
            </li>
            <li>
              <Link to="/wishlist" onClick={scrollToTop} className="flex items-center gap-1 hover:text-blue-400 transition">
                <MdKeyboardArrowRight className="text-blue-500" />
                <span>Wishlist</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" onClick={scrollToTop} className="flex items-center gap-1 hover:text-blue-400 transition">
                <MdKeyboardArrowRight className="text-blue-500" />
                <span>User Profile</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright & System Status */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>&copy; {new Date().getFullYear()} Zapster Inc. E-Commerce Product & Order Management System.</p>
       
      </div>
    </footer>
  );
};

export default Footer;
