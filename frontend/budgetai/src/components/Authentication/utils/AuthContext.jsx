import React, {createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);           // user will hold just the UID
  const [loading, setLoading] = useState(true);     // For spinner/loader
  const [accessToken, setAccessToken] = useState(null); // In-memory access token
  const refreshToken = async () => {
    try {
      const res = await fetch("https://127.0.0.1:8000/refresh_token", {
        method: "POST",
        credentials: "include", // send refreshToken cookie
      });

      if (!res.ok || res.status === 201) {
        setUser(null); // Clear user if token refresh fails
        setAccessToken(null); // Clear access token if refresh fails
        setLoading(false); // Stop loading if token refresh fails
        return;
      }
      else{
        const data = await res.json();
        await new Promise(resolve => setTimeout(resolve, 1250));
        setAccessToken(data.accessToken);
        await fetchUser(data.accessToken); // Fetch user on first render if no access token
      }
    } catch(err){
      console.error("Error in refreshToken:", err);
    }
    finally {
      setLoading(false); // Stop loading after token refresh attempt
    }
  }

  const fetchUser = async (passedAccessToken) => {
    try {
      const res = await fetch("https://127.0.0.1:8000/valid_user", {
        method: "GET",
        credentials: "include", // Include HTTP-only cookie for refresh token
        headers: {
          authorization: passedAccessToken,
        },
      });
      console.log("Response from fetchUser", res)
      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();
      setUser(data.uid); //  Set just the UID
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  // 🔁 Auto-refresh token every 55 minutes
  useEffect(() => {
    if (!accessToken){
      // If access token is not present, refresh the token immediately and fetch the user
      refreshToken();
      // Set up an interval to refresh the token every 55 minutes
      const refreshInterval = setInterval(refreshToken, 55 * 60 * 1000); // 55 minutes
    
      return () => {
        clearInterval(refreshInterval)
      };
    }
    else{
      setLoading(false); // Stop loading if access token is present
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
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
