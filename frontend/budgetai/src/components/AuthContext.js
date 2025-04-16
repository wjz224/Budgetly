import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // user will hold just the UID
  const [loading, setLoading] = useState(true);     // For spinner/loader
  const [accessToken, setAccessToken] = useState(null); // In-memory access token

  const fetchUser = async () => {
    try {
      const res = await fetch("/valid_user", {
        method: "GET",
        credentials: "include", // Include HTTP-only cookie for refresh token
        headers: {
          authorization: accessToken,
        },
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data.uid); //  Set just the UID
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,           // Just the UID
        accessToken,    // JWT stored in memory
        loading,        // Useful for route guards/loaders
        setUser,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
