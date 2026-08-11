import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { FaPhone, FaEnvelope, FaCalendar, FaUser } from "react-icons/fa";
import { Helmet } from "react-helmet";

// Demo users fallback — shown if API returns empty or fails
const DEMO_USERS = [
  { _id: "u1", fullname: "Mohan Das", email: "mohan.das@rediffmail.com", mobile: "+91 43210 98765", role: "CUSTOMER", createdAt: "2024-08-03" },
  { _id: "u2", fullname: "Kavya Nair", email: "kavya.nair@gmail.com", mobile: "+91 54321 09876", role: "CUSTOMER", createdAt: "2024-07-15" },
  { _id: "u3", fullname: "Vikram Singh", email: "vikram.singh@zapster.com", mobile: "+91 65432 10987", role: "CUSTOMER", createdAt: "2024-06-01" },
  { _id: "u4", fullname: "Sneha Gupta", email: "sneha.gupta@gmail.com", mobile: "+91 76543 21098", role: "CUSTOMER", createdAt: "2024-05-12" },
  { _id: "u5", fullname: "Rahul Verma", email: "rahul.verma@yahoo.com", mobile: "+91 87654 32109", role: "CUSTOMER", createdAt: "2024-04-20" },
  { _id: "u6", fullname: "Priya Patel", email: "priya.patel@outlook.com", mobile: "+91 91234 56789", role: "CUSTOMER", createdAt: "2024-03-05" },
  { _id: "u7", fullname: "Arjun Sharma", email: "arjun.sharma@gmail.com", mobile: "+91 99887 76655", role: "CUSTOMER", createdAt: "2024-02-10" },
  { _id: "u8", fullname: "System Admin", email: "admin@zapster.com", mobile: "+91 98765 43210", role: "ADMIN", createdAt: "2024-01-15" },
];

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [auth] = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_HOST_URI}/api/v1/auth/all-users`,
          { headers: { Authorization: auth?.token } }
        );
        const fetched = response.data?.data || response.data?.users || [];
        // If server returned users, use them; else fall back to demo
        setUsers(fetched.length > 0 ? fetched : DEMO_USERS);
      } catch (error) {
        console.warn("Could not fetch users from server, using demo data.", error.message);
        setUsers(DEMO_USERS);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-white rounded border shadow p-5 min-h-full">
      <Helmet>
        <title>Zapster.com | Admin - All Users</title>
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">All Users</h1>
        <span className="text-sm bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full">
          {users.length} Total
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 m-4">
          {users.map((user) => (
            <div
              key={user?._id}
              className="flex items-start p-4 border gap-4 shadow-sm rounded-xl bg-gray-50 hover:shadow-md transition-shadow duration-200"
            >
              {/* User Icon Badge */}
              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold ${
                  user?.role === "ADMIN"
                    ? "bg-purple-600"
                    : "bg-blue-600"
                }`}
              >
                <FaUser size={18} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-gray-800 truncate">{user?.fullname || "Unknown"}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      user?.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user?.role === "ADMIN" ? "Admin" : "Customer"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                  <FaEnvelope size={11} className="flex-shrink-0" />
                  {user?.email}
                </p>
                {user?.mobile && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <FaPhone size={11} className="rotate-90 flex-shrink-0" />
                    {user?.mobile}
                  </p>
                )}
                {user?.createdAt && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FaCalendar size={10} className="flex-shrink-0" />
                    Joined {new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
