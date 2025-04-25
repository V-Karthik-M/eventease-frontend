import { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      const isValid = (val) => val && val !== "undefined" && val !== "null" && val !== "";

      if (isValid(storedUser) && isValid(storedToken)) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);

        // Set token globally for axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

        console.log("✅ User & token restored from localStorage");
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("❌ Error restoring session:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><strong>Checking for active session...</strong></div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
