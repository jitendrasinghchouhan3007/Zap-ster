import React, { useState } from "react";
import { FaUser, FaEnvelope, FaComment, FaPhone } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet";
const WelcomePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success(
        "Thank you for contacting us. We will get back to you soon!"
      );
      setLoading(false);
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className=" md:mx-8 p-6">
       <Helmet>
        <title>Zapster.com | Contact Us</title>
      </Helmet>
      <div className=" md:flex  gap-10 my-5 ">
        <div className="w-full">
          <h1 className="text-4xl font-bold mb-6 mt-4">
            Welcome to Our Website!
          </h1>
          <p className="mb-4">
            Thank you for visiting our website. We are dedicated to providing
            valuable information and excellent services. If you have any
            questions, feedback, or inquiries, feel free to reach out to us
            using the contact form below. We would love to hear from you!
          </p>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Our Location</h2>
            <p className="mb-2">
              We are located in the heart of India[M.P.], easily accessible and
              ready to assist you.
            </p>
            <p className="flex items-center mb-2 px-8">
              <FaEnvelope className="mr-2" /> Email: mrnamdev1372000@gmail.com
            </p>
            <p className="flex items-center px-8">
              <FaPhone className="mr-2 rotate-90" /> Phone: +91-8120544147
            </p>
          </div>
        </div>
        <div className="bg-gray-300 p-9 rounded-lg border w-full">
          <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                <FaUser className="inline mr-2" />
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                <FaEnvelope className="inline mr-2" />
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                <FaComment className="inline mr-2" />
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                placeholder="Your Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
              ></textarea>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-600 disabled:hover:bg-gray-600"
                type="submit"
                disabled={loading}
              >
                {loading ? "Please wait..." : " Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
