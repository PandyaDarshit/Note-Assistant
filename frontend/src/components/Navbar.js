// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand/Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white hover:text-white/90 transition-colors">
                Mukti: Your AI Note Taker
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${location.pathname === '/'
                  ? 'bg-white text-indigo-600'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              Create Notes
            </Link>
            <Link
              to="/notes"
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${location.pathname === '/notes'
                  ? 'bg-white text-indigo-600'
                  : 'text-white hover:bg-white/10'
                }`}
            >
              My Notes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;