import React from "react";
import { useAuth } from "../context/auth.jsx";
import LoginRequired from "../components/LoginRequired.jsx";
import { Outlet } from "react-router-dom";

const IsAdmin = () => {
  const [auth] = useAuth();

  if (auth.user?.role === "ADMIN") {
    return <Outlet />;
  }

  return <LoginRequired content="Sorry!!You are not Admin" title="Unauthorized Login" />;
};

export default IsAdmin;
