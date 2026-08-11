import React from "react";
import { Helmet } from "react-helmet";
import {
  FaGlobe,
  FaClock,
  FaShieldAlt,
  FaHeadphones,
  FaCheckCircle,
  FaUsers
} from "react-icons/fa";

const AboutUs = () => {
  return (
    <>
      <Helmet>
        <title>Zapster.com | About Us</title>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 flex items-center justify-center">
          About Us - Zapster
        </h1>

        <div className="mb-8 mx-14">
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to Zapster – Your Ultimate Shopping Destination! At Zapster,
            we redefine your online shopping experience with a curated selection
            of products that cater to your diverse needs. As an innovative
            e-commerce platform, we take pride in offering a seamless journey
            from discovery to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-14">
          {[
            {
              icon: FaGlobe,
              title: "Explore a World of Choices",
              content:
                "Dive into a virtual marketplace where endless possibilities await. From cutting-edge electronics to fashion-forward apparel, home essentials to lifestyle accessories, Zapster is your one-stop shop for all things fabulous and functional.",
            },
            {
              icon: FaClock,
              title: "Unmatched Convenience",
              content:
                "We understand the value of your time, which is why we've designed Zapster to be user-friendly and efficient. Our intuitive interface ensures that you can effortlessly navigate through our extensive catalog, find what you need, and complete your purchase with just a few clicks.",
            },
            {
              icon: FaCheckCircle,
              title: "Quality Assurance",
              content:
                "Quality is our priority. We collaborate with reputable sellers and brands to bring you products that meet the highest standards. Every item on Zapster is carefully selected to ensure that you receive not only what you want but also top-notch quality.",
            },
            {
              icon: FaShieldAlt,
              title: "Secure Shopping Environment",
              content:
                "Your security is our utmost concern. Shop with confidence, knowing that Zapster employs state-of-the-art security measures to safeguard your personal information and transactions. Your privacy matters to us, and we go the extra mile to ensure a secure online environment.",
            },
            {
              icon: FaHeadphones,
              title: "Exceptional Customer Service",
              content:
                "Our commitment to customer satisfaction is unwavering. If you have any inquiries, concerns, or need assistance, our dedicated customer support team is just a message away. We are here to make your Zapster experience as smooth and enjoyable as possible.",
            },
            {
              icon: FaUsers,
              title: "Join the Zapster Community",
              content:
                "Embark on a shopping journey like never before. Join our growing community of satisfied customers who have discovered the joy of shopping at Zapster. Stay updated on the latest trends, exclusive deals, and exciting promotions as we continue to enhance your shopping experience.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl"
            >
              <item.icon className="text-4xl text-gray-600 mb-4 flex w-full justify-center " />
              <h2 className="text-xl font-semibold mb-3 text-center">{item.title}</h2>
              <p className="text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl font-semibold text-gray-900">
            Zapster – Where Convenience Meets Quality. Start shopping now!
          </p>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
