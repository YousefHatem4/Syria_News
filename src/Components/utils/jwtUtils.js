// utils/jwtUtils.js

/**
 * Decode JWT token to extract payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token");
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Base64 URL decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));

    return decodedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

/**
 * Extract user information from JWT token
 * @param {string} token - JWT token
 * @returns {Object} User information
 */
export const extractUserInfo = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return {
      userImage: "",
      userName: "",
      email: "",
      userId: "",
      role: "",
    };
  }

  return {
    userImage: decoded.userImage || "",
    userName: decoded.userName || "",
    email: decoded.sub || "",
    userId: decoded.userId || "",
    role: decoded.role?.[0]?.authority || "",
  };
};
