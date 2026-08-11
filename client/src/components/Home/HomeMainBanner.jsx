import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

const HomeMainBanner = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    arrows: false,
    fade: true,
    focusOnSelect: false,
    appendDots: (dots) => (
      <div style={{ position: "absolute", bottom: "10px", right: "10px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  return (
    <div className="flex flex-col md:flex-row md:px-12 px-4 py-3">
      <div className="w-full md:w-[50%]">
        <Slider {...settings}>
          <div className="rounded-xl overflow-hidden relative">
            <div className="absolute top-5 left-5 md:top-24 md:left-8">
              <h5 className="text-blue-500 font-semibold">Upto 45% OFF</h5>
              <h3 className="font-bold text-2xl">Special Offer</h3>
              <p className="text-sm w-36">
                Shop the latest earBuds with discount.
              </p>
              <button
                className="bg-blue-600 text-white rounded-2xl p-2 px-5 text-sm mt-4 hover:bg-blue-700 cursor-pointer"
                onClick={() => navigate(`/category/earbuds`)}
              >
                Buy Now
              </button>
            </div>
            <img
              src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725193533/s3wzuizeryp2kdmldxku.jpg"
              alt="Carousel Image 1"
              className="object-cover rounded-xl select-none"
            />
          </div>
          <div className="rounded-xl overflow-hidden relative">
            <div className="absolute top-5 left-5 md:top-24 md:left-8">
              <h5 className="text-blue-500 font-semibold">TRENDY EARBUDS</h5>
              <h3 className="font-bold text-2xl">AirPods Pro</h3>
              <p className="w-36">
                (2nd generation){" "}
                <span className="text-red-400 font-semibold mt-2">
                  ₹24900.00*
                </span>
              </p>
              <button
                onClick={() => navigate(`/product/AirPods-Pro`)}
                className="bg-blue-600 text-white rounded-2xl p-2 px-5 text-sm mt-4 hover:bg-blue-700 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
            <img
              src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725193533/f49qbkcrypaziiq9fanf.jpg"
              alt="Carousel Image 2"
              className="object-cover rounded-xl select-none"
            />
          </div>
        </Slider>
      </div>

      <div className="grid grid-cols-2 gap-2 md:pl-4">
        <div className="relative overflow-hidden">
          <div className="absolute md:top-10 top-5 left-5">
            <h5 className="text-blue-500 text-sm font-semibold">BEST SALE</h5>
            <h3 className="font-bold text-xl md:text-2xl">Hp-14S</h3>
            <p className="text-sm">See Specifications</p>
          </div>
          <img
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725193533/jnisphq7jwwudcff3i0i.jpg"
            alt="Grid Image 1"
            className="object-cover rounded-lg select-none"
          />
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute md:top-10 top-5 left-5">
            <h5 className="text-blue-500 text-sm font-semibold">NEW ARRIVAL</h5>
            <h3 className="font-bold text-xl md:text-2xl">Buy IPad Air</h3>
            <p className="text-sm">From ₹56,800</p>
          </div>
          <img
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725193533/repvrmditnwxxwvmvjt7.jpg"
            alt="Grid Image 2"
            className="object-cover rounded-lg select-none"
          />
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute md:top-10 top-5 left-5">
            <h5 className="text-blue-500 text-sm font-semibold">45% OFF</h5>
            <h3 className="font-bold text-xl md:text-2xl">FLippY 4</h3>
            <p className="text-sm w-36">Shop now</p>
          </div>
          <img
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725193533/rzcsn1achmddsrjrgajj.jpg"
            alt="Grid Image 3"
            className="object-cover rounded-lg select-none"
          />
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute md:top-10 top-5 left-5">
            <h5 className="text-blue-500 text-sm font-semibold">FREE ENGRAVING</h5>
            <h3 className="font-bold text-xl md:text-2xl">Boat Rockers</h3>
            <p className="text-sm w-36">Get it now</p>
          </div>
          <img
            src="https://res.cloudinary.com/dwanfti2a/image/upload/v1725193533/fmwglhf7oe3ytxjct0mt.jpg"
            alt="Grid Image 4"
            className="object-cover rounded-lg select-none"
          />
        </div>
      </div>
    </div>
  );
};

export default HomeMainBanner;
