// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
            <Link to="/teams" className="hover:text-green-400">Teams</Link>
          </div>

          {/* Login/Register Button */}
          <div>
            <Link to="/login">
              <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
