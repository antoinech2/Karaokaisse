import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token }); // Définit `user` si un token est présent
      console.log("User authenticated with token:", token); // Debugging
    } else {
      console.log("No token found in localStorage."); // Debugging
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    console.log("User logged in:", userData); // Debugging
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    console.log("User logged out."); // Debugging
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
