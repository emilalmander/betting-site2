// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Login-funktion
  const login = (userData) => {
    console.log("login anropas med data:", userData); // Kontrollera att login körs
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Kontrollera om isLoggedIn ändras
  useEffect(() => {
    console.log("isLoggedIn i AuthContext har ändrats:", isLoggedIn);
  }, [isLoggedIn]);

  // Logout-funktion
  const logout = () => {
    console.log("logout anropas");
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Hämta användardata från localStorage när appen laddas om eller startar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
