// Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setShowLogoutConfirm(true);
    }
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <nav className="sticky top-0 bg-gray-900 bg-opacity-95 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <Link to="/">YourLogo</Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-green-400">Home</Link>
            <Link to="/howToBet" className="hover:text-green-400">How to Bet</Link>
            <Link to="/matches" className="hover:text-green-400">Matcher</Link>
            <Link to="/teams" className="hover:text-green-400">Teams</Link>
            <Link to="/profile" className="text-green-500 hover:text-green-400">Profile</Link>
          </div>

          {/* Login/Logout Button */}
          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={handleLoginLogout}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Logga ut
              </button>
            ) : (
              <Link to="/login">
                <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                  Logga in
                </button>
              </Link>
            )}

            {/* Confirmation Popup */}
            {showLogoutConfirm && (
              <div className="absolute top-12 right-0 bg-gray-800 text-white p-4 rounded-md shadow-md">
                <p>Är du säker på att du vill logga ut?</p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={confirmLogout}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md"
                  >
                    Ja
                  </button>
                  <button
                    onClick={cancelLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                  >
                    Nej
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
