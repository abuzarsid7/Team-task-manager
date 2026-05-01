import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    setLoading(false);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = useMemo(() => ({
    token,
    isAuthenticated: Boolean(token),
    login,
    logout
  }), [token]);

  const getUserId = () => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(payload));
      return decoded.userId || decoded.sub || null;
    } catch {
      return null;
    }
  };

  const exported = useMemo(() => ({ ...value, getUserId }), [value]);

  // 🚨 THIS LINE FIXES YOUR ISSUE
  if (loading) return null;

  return (
    <AuthContext.Provider value={exported}>
      {children}
    </AuthContext.Provider>
  );
};