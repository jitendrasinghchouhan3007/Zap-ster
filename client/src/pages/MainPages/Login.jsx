import React, { useState } from "react";
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { Helmet } from "react-helmet";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(response.data));
        navigate('/');
        toast.success(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Invalid password Or email!");
      } else {
        toast.error("Login failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <Helmet>
        <title>Zapster.com | Login</title>
      </Helmet>

      <div className="bg-white  shadow-md rounded px-8 pt-6 pb-8 mb-4 ">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-1">
            <label
              className="block   text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3   text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="text-end mb-3 pr-5">
            <Link
              to="/forgot-password"
              className=" text-sm text-blue-500 hover:text-blue-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <button
              className={`bg-C hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </div>
        </form>
        <p className="text-sm mt-4">
          By continuing, you agree to Zapster's{" "}
          <Link
            to="/terms&conditions"
            className="text-blue-500 hover:underline"
          >
            Conditions of Use
          </Link>{" "}
          and{" "}
          <Link to="/privacy-policy" className="text-blue-500 hover:underline">
            Privacy policy
          </Link>
          .
        </p>
      </div>
      <div className="text-center ">
        <p className="text-sm text-gray-600">New to Zapster?</p>
        <Link
          to="/register"
          className="inline-block pb-3 align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 mt-2"
        >
          Create your Zapster account
        </Link>
      </div>
    </>
  );
};

export default Login;
