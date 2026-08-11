import React from "react";
import Banner from "../../components/Home/Banner";
import RenderCategoriesOnHome from "../../components/Home/RenderCategoriesOnHome";
import RenderProductsOnHome from "../../components/Home/RenderProductsOnHome";
import HomeMainBanner from "../../components/Home/HomeMainBanner";
import ProductCarousel from "../../components/Home/ProductCarousel";
import RenderBrandsOnHome from "../../components/Home/RenderBrandsOnHome";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";


const Home = () => {
  const navigate = useNavigate();
  return (
    <>
     <Helmet>
        <title>Zapster.com | Home </title>
      </Helmet>
      <RenderCategoriesOnHome />
      <HomeMainBanner />
      <ProductCarousel
        heading="Featured Collection"
        fetchApi={`${import.meta.env.VITE_HOST_URI}/api/v1/product/featured-products`}
      />
      <RenderBrandsOnHome />
      <RenderProductsOnHome
        heading="Best Deals on Smartphones"
        fetchApi={`${import.meta.env.VITE_HOST_URI}/api/v1/product/productsByCategory/mobiles`}
      />
      <ProductCarousel
        heading="Trendy Laptops"
        fetchApi={`${import.meta.env.VITE_HOST_URI}/api/v1/product/productsByCategory/Laptops`}
      />

      <div className="grid md:grid-cols-4 grid-cols-2 gap-4 md:px-12 px-4 my-8">
        <div className="rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover rounded-xl select-none"
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725388808/dmoupli3b8mhdmp0inaa.jpg"
            alt="Pad Pro Banner"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover rounded-xl select-none"
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725388808/dc5l5oqhdwitfwzy9ejx.jpg"
            alt="Galaxy Tab Banner"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover rounded-xl select-none"
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725388808/imlghu4m09pbz7cudkhk.jpg"
            alt="Smart Watch Banner"
          />
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover rounded-xl select-none"
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725388808/e7qjinb8svv7utwgcacu.jpg"
            alt="Envy x360 Banner"
          />
        </div>
      </div>

      <Banner />
    </>
  );
};

export default Home;
