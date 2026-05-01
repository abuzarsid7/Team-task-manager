import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

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

  // helper to extract userId from JWT token payload
  const getUserId = () => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(decodeURIComponent(escape(window.atob(payload))));
      return decoded.userId || decoded.user_id || decoded.sub || null;
    } catch (e) {
      return null;
    }
  };

  // extend exported value with helper
  const exported = useMemo(() => ({ ...value, getUserId }), [value, token]);

  return (
    <AuthContext.Provider value={exported}>
      {children}
    </AuthContext.Provider>
  );
};