import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import checkAuth from "./checkAuth"; // Import the checkAuth utility

const ProtectedRoute = ({ children }) => {
  const { accessToken, setUser, setAccessToken } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Track authentication status
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const validateAuth = async () => {
      if (!accessToken) {
        setIsAuthenticated(false); // No token, user is not authenticated
        setLoading(false);
        return;
      }

      const isValid = await checkAuth(accessToken); // Validate the token
      if (isValid) {
        setIsAuthenticated(true); // Token is valid
      } else {
        setIsAuthenticated(false); // Token is invalid or expired
        setUser(null); // Clear user state
        setAccessToken(null); // Clear access token
      }
      setLoading(false); // Stop loading
    };

    validateAuth();
  }, [accessToken, setUser, setAccessToken]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading spinner while validating
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  return children; // Render the protected component if authenticated
};

export default ProtectedRoute;