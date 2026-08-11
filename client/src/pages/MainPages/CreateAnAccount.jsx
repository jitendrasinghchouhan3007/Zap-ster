import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Helmet } from "react-helmet";

const initialFormData = {
  fullname: "",
  email: "",
  password: "",
  mobile: "",
  profilePicture: null,
};

const CreateAnAccount = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send as JSON (server uses req.body via express.json())
    const payload = {
      name: formData.fullname,
      email: formData.email,
      password: formData.password,
      mobile: formData.mobile,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_HOST_URI}/api/v1/auth/register`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      // Server returns { message, token, user } on success (201)
      toast.success("Account created successfully!");
      setFormData(initialFormData);
      setPreview(null);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
       <Helmet>
        <title>Zapster.com | Create an account</title>
      </Helmet>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <InputField
            label="Your Name"
            id="fullname"
            type="text"
            placeholder="First and last name"
            value={formData.fullname}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email"
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            placeholder="*****"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <InputField
            label="Mobile Number"
            id="mobile"
            type="tel"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          <InputField
            label="Profile Picture"
            id="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {preview && (
            <div className="flex items-center mt-4">
              <p className="text-sm text-gray-700 mr-4">Preview:</p>
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          )}
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mt-6 disabled:bg-gray-600 disabled:hover:bg-gray-600"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
      <p className="text-sm mt-4 text-gray-600">
        By creating an account or logging in, you agree to Zapster's{" "}
        <Link to="/terms&conditions" className="text-blue-500 hover:underline">
          Conditions of Use
        </Link>{" "}
        and{" "}
        <Link to="/privacy-policy" className="text-blue-500 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">Already have an account?</p>
        <Link
          to="/login"
          className="inline-block font-bold text-sm text-blue-500 hover:text-blue-800 mt-2"
        >
          Log in to Zapster
        </Link>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, placeholder, value, onChange, required }) => (
  <div className="mb-4">
    <label
      className="block text-gray-700  text-sm font-bold mb-2"
      htmlFor={id}
    >
      {label}
    </label>
    <input
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default CreateAnAccount;