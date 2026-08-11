import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast} from "react-hot-toast";
import { Helmet } from "react-helmet";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`${import.meta.env.VITE_HOST_URI}/api/v1/auth/forgot-password`, {
        email,
        securityAnswer,
        newPassword
      });
      if (data.success) {
        toast.success(data?.message || "New Password Updated Successfully");
        setNewPassword('');
        setEmail("");
        setSecurityAnswer("");
        navigate("/login");
        
      } else {
        toast.error(data?.message || "Something went wrong");
        setNewPassword('');
        setEmail("");
        setSecurityAnswer("");
      }
    } catch (error) {
    
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
     <Helmet>
        <title>Zapster.com | Forgot Password</title>
      </Helmet>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block  text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block  text-gray-700 text-sm  mb-2"
              htmlFor="securityAnswer"
            >
             <span className="font-bold"> Security Answer</span> <span className="text-gray-400">(You set during Account creation)</span>
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3   text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="securityAnswer"
              type="text"
               placeholder="What is your best friend's name?"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3  text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
              id="newPassword"
              type="password"
               placeholder="*****"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-C hover:bg-yellow-500 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-600 disabled:hover:bg-gray-600"
              type="submit"
              disabled={loading}
            >
             {loading ? "Please wait..." : " Reset Password"}
            </button>
          </div>
        </form>
      </div>
      <div className="text-center mb-2">
        <Link
          to="/login"
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
        >
          Back to Login
        </Link>
      </div>
    </>
  );
};

export default ForgotPassword;
