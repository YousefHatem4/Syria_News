// hooks/useUserInfo.js
import { useState, useEffect, useContext } from "react";
import { userContext } from "../Context/userContext";
import { extractUserInfo } from "../utils/jwtUtils";

/**
 * Custom hook to extract and manage user information from JWT token
 * @returns {Object} User information
 */
export const useUserInfo = () => {
  const { userToken } = useContext(userContext);
  const [userInfo, setUserInfo] = useState({
    userImage: "",
    userName: "",
    email: "",
    userId: "",
    role: "",
    isAuthenticated: false,
  });

  useEffect(() => {
    if (userToken) {
      const info = extractUserInfo(userToken);
      setUserInfo({
        ...info,
        isAuthenticated: true,
      });
    } else {
      // Try to get from localStorage as fallback
      const storedToken = localStorage.getItem("userToken");
      if (storedToken) {
        const info = extractUserInfo(storedToken);
        setUserInfo({
          ...info,
          isAuthenticated: true,
        });
      } else {
        setUserInfo({
          userImage: "",
          userName: "",
          email: "",
          userId: "",
          role: "",
          isAuthenticated: false,
        });
      }
    }
  }, [userToken]);

  return userInfo;
};
