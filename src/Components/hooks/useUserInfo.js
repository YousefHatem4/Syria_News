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
    numOfArticles: "0",
    isAuthenticated: false,
  });

  useEffect(() => {
    if (userToken) {
      const info = extractUserInfo(userToken);
      setUserInfo({
        ...info,
        isAuthenticated: true,
      });

      // Also store numOfArticles in localStorage for persistence
      if (info.numOfArticles) {
        localStorage.setItem("userNumOfArticles", info.numOfArticles);
      }
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
        // Try to get numOfArticles from localStorage if token is not available
        const storedNumOfArticles =
          localStorage.getItem("userNumOfArticles") || "0";
        setUserInfo({
          userImage: "",
          userName: "",
          email: "",
          userId: "",
          role: "",
          numOfArticles: storedNumOfArticles,
          isAuthenticated: false,
        });
      }
    }
  }, [userToken]);

  return userInfo;
};
