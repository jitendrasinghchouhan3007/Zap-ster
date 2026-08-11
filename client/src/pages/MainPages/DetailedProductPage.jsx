import React, { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { BsTruck } from "react-icons/bs";
import { FaClockRotateLeft } from "react-icons/fa6";
import { GoShieldCheck } from "react-icons/go";
import { useParams, useNavigate } from "react-router-dom";
import { BiSolidLockAlt } from "react-icons/bi";
import { FaHeart } from "react-icons/fa";
import { SlTrophy } from "react-icons/sl";
import renderRatingStars from "../../components/RenderRatingStars";
import SimilarProducts from "../../components/DetailedProductPage/SimilarProducts";
import OopsNotFound from "../../components/OopsNotFound";
import Breadcrumb from "../../components/Breadcrumb";
import Spinner from "../../components/Spinner";
import { useWishlist } from "../../context/wishlist";
import { useAuth } from "../../context/auth";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";
import { FaStar } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import { useCart } from "../../context/cart";
import { Helmet } from "react-helmet";

const DetailedProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wait, setWait] = useState(false);
  const [auth] = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const { isInWishlist, fetchWishlist } = useWishlist();
  const { isInCart, addToCart, waitForAdd } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loadReview, setLoadReview] = useState(false);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_HOST_URI}/api/v1/product/${slug}`);
      setProduct(response.data.product);
      setSelectedImage(response.data.product.images[0]);
      getSimilarProduct(
        response.data.product._id,
        response.data.product.category._id
      );
      setLoading(false);
    } catch (err) {
      toast.error("Error fetching product details");
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isInCart(product._id)) {
      addToCart(product._id);
      toast.success("Product added to cart");
    } else {
      navigate("/cart");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const getSimilarProduct = async (pid, cid) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_HOST_URI}/api/v1/product/similar-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleWishlist = async () => {
    if (!product) return;

    try {
      if (isInWishlist(product._id)) {
        // Remove from wishlist
        setWait(true);
        await axios.put(`${import.meta.env.VITE_HOST_URI}/api/v1/product/removetowishlist/${product._id}`, {
          headers: {
            Authorization: auth.token,
          },
        });
        toast.success("Product removed from wishlist");
        setWait(false);
      } else {
        // Add to wishlist
        setWait(true);
        await axios.put(`${import.meta.env.VITE_HOST_URI}/api/v1/product/addtowishlist/${product._id}`, {
          headers: {
            Authorization: auth.token,
          },
        });
        toast.success("Product added to wishlist");
        setWait(false);
      }
      fetchWishlist();
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setWait(false);
    }
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date)) return "N/A";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const descriptionListrender = (description) => {
    return (
      <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed">
        {description.split("•").map(
          (item, index) =>
            item.trim() && (
              <li key={index} className="my-2">
                {item.trim()}
              </li>
            )
        )}
      </ul>
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.error("Both fields are required!");
      return;
    }

    try {
      setLoadReview(true);
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URI}/api/v1/review/${product._id}`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      fetchProduct();
      setLoadReview(false);
      toast.success(response.data.message || "Review submitted successfully!");
      toggleModal();
      setRating(0);
      setComment("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      toggleModal();
      setRating(0);
      setComment("");
    } finally {
      setLoadReview(false);
    }
  };

  const toggleModalCancel = () => {
    toggleModal();
    setRating(0);
    setComment("");
  };

  return (
    <>
     <Helmet>
        <title>Zapster.com | {slug}</title>
      </Helmet>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="max-w-7xl mx-auto p-6 bg-gray-100">
            <Breadcrumb
              TypeName={product.category.name}
              navTo={`/category/${product.category.name}`}
              name={product.name}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:sticky top-0">
                <div className="md:sticky top-0 flex flex-col-reverse md:flex-row space-x-4 px-6 md:px-0 space-y-4">
                  <div className="md:sticky top-0 flex md:flex-col flex-shrink-0 space-y-4 items-center md:space-y-2 md:space-x-0 space-x-2 justify-center j">
                    {product.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${product.name} small image ${index + 1}`}
                        onClick={() => handleImageClick(image)}
                        className={`md:w-24 md:h-24 w-20 h-20 object-contain rounded-lg shadow-md cursor-pointer transition-transform ${
                          image === selectedImage ? "border-2 border-C" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <img
                      src={selectedImage}
                      alt={`${product.name} big image`}
                      className="w-full h-auto object-cover rounded-lg shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details Section */}
              <div className="flex flex-col space-y-4 ">
                <h1 className="text-3xl font-bold text-gray-900 ">
                  <span>{product.brand.name}</span> {product.name}
                </h1>

                <div className="flex items-center space-x-2">
                  <div className="flex justify-center items-center mb-2">
                    {renderRatingStars(product.ratings.averageRating)}
                    <span className="text-gray-500">
                      ({product.ratings.averageRating})
                    </span>
                  </div>
                  <span className="text-lg text-gray-600">
                    ({product.ratings.numberOfReviews} reviews )
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl text-green-700 ">
                      {product.discount}% off
                    </span>

                    <p className="flex items-start text-2xl font-semibold text-gray-900">
                      <span className="text-xl">₹</span>
                      <span>
                        {product.discountPrice.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                  <div className="font-semibold">
                    <p>
                      <span className="text-gray-500">M.R.P.&nbsp;</span>
                      <span className="line-through text-gray-500 ">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </span>
                    </p>
                    <span className="text-sm mt-4">Inclusive of all taxes</span>
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <div className="flex gap-6">
                    <button
                      className="bg-C px-14 rounded-2xl shadow hover:bg-yellow-500 transition disabled:bg-gray-500 disabled:hover:bg-gray-500"
                      onClick={auth.user ? handleAddToCart : ()=> toast("Login Required", {
                        icon: "☠️",
                      }) }
                      disabled={waitForAdd}
                    >
                     {waitForAdd ? "Please wait..." : <> {isInCart(product._id) ? "Go to Cart" : "Add to Cart"}</>}
                    </button>

                    <button
                      disabled={wait}
                      onClick={
                        auth.user
                          ? handleWishlist
                          : () =>
                              toast("Login Required", {
                                icon: "☠️",
                              })
                      }
                      className={` transform  transition-transform hover:scale-125 rounded-full p-2 shadow-xl border ${
                        isInWishlist(product._id) ? "bg-red-500" : "bg-white"
                      }  ${wait ? "disabled:bg-gray-400" : null}`}
                      title={
                        isInWishlist(product._id)
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      {wait ? (
                        <>
                          <FaSpinner className="animate-spin" />
                        </>
                      ) : (
                        <FaHeart
                          size={24}
                          color={
                            isInWishlist(product._id) ? "white" : "lightgray"
                          }
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Product Details Table */}
                <table className="w-fit bg-white">
                  <tbody>
                    <tr className="bg-white">
                      <th className="py-2 px-4 border text-left">Brand</th>
                      <td className="py-2 px-4 border">{product.brand.name}</td>
                    </tr>
                    <tr className="bg-white">
                      <th className="py-2 px-4 border text-left">Model Name</th>
                      <td className="py-2 px-4 border">{product.name}</td>
                    </tr>
                    <tr className="bg-white">
                      <th className="py-2 px-4 border text-left">Category</th>
                      <td className="py-2 px-4 border">
                        {product.category.name}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <th className="py-2 px-4 border text-left">In Stock</th>
                      <td className="py-2 px-4 border">{product.quantity}</td>
                    </tr>
                  </tbody>
                </table>

                <hr />
                <div className="flex items-center gap-5 justify-center shadow border text-gray-600 bg-white p-3 md:mx-10">
                  <div className="pl-5">
                    <div className="flex justify-center">
                      <div className=" bg-C text-white  p-3 rounded-full">
                        <GoShieldCheck size={24} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-center">
                      Trusted Partner
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-center">
                      <div className=" bg-C text-white  p-3 rounded-full">
                        <BsTruck size={24} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-center">
                      Free Delivery
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-center">
                      <div className=" bg-C text-white  p-3 rounded-full">
                        <BiSolidLockAlt size={24} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-center">
                      Secure transaction
                    </p>
                  </div>

                  <div className="pr-5">
                    <div className="flex justify-center">
                      <div className=" bg-C text-white  p-3 rounded-full">
                        <SlTrophy size={24} />
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-center">
                      Top Brand
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="text-gray-700 border-y border-gray-400 md:p-3 py-3 m-5">
                  <h3 className="text-xl font-bold">About this item</h3>
                  {descriptionListrender(product.description)}
                  <div className="my-5 flex flex-wrap gap-3">
                    {product.tags.map((tag, index) => (
                      <span
                        className="bg-gray-300 py-2 px-5 rounded-xl font-semibold"
                        key={`${tag}${index}`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1 items-center justify-center">
                  <span className="text-sm">Powered & Supported by</span>
                  <img src={product.brand.image} alt="1d" className="h-10" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white mx-8 border shadow ">
            <div className=" flex justify-between  p-5">
              <h2 className="md:text-3xl text-xl font-bold">
                Reviews & Ratings
              </h2>
              <button
                className="mr-6 md:text-xl border px-3 py-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded"
                onClick={
                  auth.user
                    ? toggleModal
                    : () =>
                        toast("Login Required", {
                          icon: "☠️",
                        })
                }
              >
                Rate Product
              </button>
            </div>

            <div className="flex gap-6 px-8 py-5 overflow-scroll custom-scrollbar">
              {product.reviews.length === 0 ? (
                <>
                  <OopsNotFound
                    content="No Product Reviews"
                    overRideCSS="w-[100vw]"
                  />
                </>
              ) : (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className=" bg-gray-100 border border-gray-200 rounded-lg shadow-md  p-8  min-w-60 overflow-hidden"
                  >
                    <div className="text-center text-gray-600">
                      <div className="flex justify-center">
                        <img
                          src={review?.user?.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                          className="w-14 h-14 rounded-full object-cover "
                          alt={review?.user?.fullname || "Unknown"}
                        />
                      </div>
                      <h2 className="text-sm font-bold">
                        {review?.user?.fullname || "User Not Found"}
                      </h2>
                      <p className="text-sm ">{review?.user?.email|| "Unknown User"}</p>
                      <p className="flex justify-center">
                        {renderRatingStars(review.rating)}
                      </p>
                      <p>{review.comment}</p>
                      <div className="mt-1 flex justify-center text-sm border-t border-gray-400  text-gray-400 items-center gap-1">
                        <FaClockRotateLeft />
                        {formatDate(review.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <SimilarProducts
            relatedProducts={relatedProducts}
            loading={loading}
          />
        </>
      )}
      <>
        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          content={
            <div className="bg-white rounded-lg md:w-80  ">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-center  text-gray-800 ">
                  Leave a Review
                </h2>
                <button onClick={toggleModalCancel}>
                  <ImCancelCircle size={19} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Rating Section */}
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700  mb-2">
                    Rating
                  </label>
                  <div className="flex">
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;

                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            className="hidden"
                            onClick={() => setRating(ratingValue)}
                          />
                          <FaStar
                            size={30}
                            color={
                              ratingValue <= (hover || rating)
                                ? "#ffc107"
                                : "#e4e5e9"
                            }
                            className="cursor-pointer transition-colors duration-200"
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Comment Section */}
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700  mb-2">
                    Comment
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loadReview}
                  className={`w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-500 transition-colors disabled:bg-indigo-200`}
                >
                  {loadReview ? "Please wait..." : " Submit Review"}
                </button>
              </form>
            </div>
          }
        />
      </>
    </>
  );
};

export default DetailedProductPage;
