// export default Navbar;
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ onAboutClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail");

  const isActive = (path) => location.pathname === path;

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (onAboutClick) onAboutClick();
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/30 backdrop-blur-xl border-b border-white/40 shadow-md z-50 p-4 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl ml-10 font-bold text-gray-900 hover:text-gray-700 transition"
        >
          Coloryze
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`px-3 py-2 font-semibold ${
              isActive("/")
                ? "text-gray-900 border-b-2 border-[#9b6ef3]"
                : "text-gray-700 hover:text-gray-900"
            } transition`}
          >
            Home
          </Link>

          <a
            href="#about"
            onClick={handleAboutClick}
            className="px-3 py-2 font-semibold text-gray-700 hover:text-gray-900 transition"
          >
            About
          </a>

          {token && (
            <>
              <Link
                to="/analyze-skin-tone"
                className={`px-3 py-2 font-semibold ${
                  isActive("/analyze-skin-tone")
                    ? "text-gray-900 border-b-2 border-[#9b6ef3]"
                    : "text-gray-700 hover:text-gray-900"
                } transition`}
              >
                Analyze Skin Tone
              </Link>
              <Link
                to="/outfit-recommendation"
                className={`px-3 py-2 font-semibold ${
                  isActive("/outfit-recommendation")
                    ? "text-gray-900 border-b-2 border-[#9b6ef3]"
                    : "text-gray-700 hover:text-gray-900"
                } transition`}
              >
                Outfit Recommendation
              </Link>
            </>
          )}

          <Link
            to="/identify-skin-tone"
            className={`px-3 py-2 font-semibold ${
              isActive("/identify-skin-tone")
                ? "text-gray-900 border-b-2 border-[#9b6ef3]"
                : "text-gray-700 hover:text-gray-900"
            } transition`}
          >
            Identify Skin Tone
          </Link>

          {/* Auth Buttons */}
          {token ? (
            <>
              <span className="text-gray-900 font-semibold">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#b388ff] to-[#81d4fa] text-white px-4 py-2 rounded-full hover:scale-105 transition transform shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#b388ff] to-[#81d4fa] text-white px-4 py-2 rounded-full hover:scale-105 transition transform shadow-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-[#f48fb1] to-[#ffe082] text-white px-4 py-2 rounded-full hover:scale-105 transition transform shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-900 p-2 hover:text-gray-700 transition"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 bg-white/30 backdrop-blur-xl border-t border-white/40 shadow-md rounded-b-lg">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Home
            </Link>
            <a
              href="#about"
              onClick={handleAboutClick}
              className="py-2 font-medium text-gray-700 hover:text-gray-900 transition"
            >
              About
            </a>
            {token && (
              <>
                <Link
                  to="/analyze-skin-tone"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Analyze Skin Tone
                </Link>
                <Link
                  to="/outfit-recommendation"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2 font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Outfit Recommendation
                </Link>
              </>
            )}
            <Link
              to="/identify-skin-tone"
              onClick={() => setIsMenuOpen(false)}
              className="py-2 font-medium text-gray-700 hover:text-gray-900 transition"
            >
              Identify Skin Tone
            </Link>

            {/* Auth Buttons */}
            {token ? (
              <>
                <span className="py-2 font-medium text-gray-900">{userEmail}</span>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-[#b388ff] to-[#81d4fa] text-white py-2 rounded-full hover:scale-105 transition transform shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-[#b388ff] to-[#81d4fa] text-white py-2 rounded-full text-center hover:scale-105 transition transform shadow-md"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-gradient-to-r from-[#f48fb1] to-[#ffe082] text-white py-2 rounded-full text-center hover:scale-105 transition transform shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
