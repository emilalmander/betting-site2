// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // Här lagrar vi användardata

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData); // Uppdatera med användardata vid inloggning
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null); // Rensa användardata vid utloggning
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
