import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  if (auth?.token) {
    axios.defaults.headers.common["Authorization"] = auth.token.startsWith("Bearer ")
      ? auth.token
      : `Bearer ${auth.token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      try {
        const parseData = JSON.parse(data);
        const formattedUser = parseData.user ? {
          ...parseData.user,
          fullname: parseData.user.fullname || parseData.user.name || "User"
        } : null;

        setAuth({
          user: formattedUser,
          token: parseData.token || "",
        });
      } catch (e) {
        localStorage.removeItem("auth");
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
