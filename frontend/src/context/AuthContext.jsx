import React, { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/resources";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("volunteer_token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setUser(res.data.data))
      .catch(() => localStorage.removeItem("volunteer_token"))
      .finally(() => setLoading(false));
  }, []);

  function loginSuccess({ user, token }) {
    localStorage.setItem("volunteer_token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("volunteer_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
