// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Navbar = ({ onAboutClick }) => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const location = useLocation();

//     const isActive = (path) => location.pathname === path;

//     return (
//         <nav className="fixed top-0 p-4 left-0 w-full bg-[#E5C19F]/50 shadow-lg z-50 backdrop-blur-md border-black/50 border-b-[5px]">
//             <div className="w-full px-6">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Left - Brand Name */}
//                     <div className="flex-shrink-0">
//                         <Link to="/" className="text-3xl ml-10 font-abril font-bold text-gray-800 hover:text-gray-600">
//                             Coloryze
//                         </Link>
//                     </div>

//                     {/* Center - Navigation Links (Desktop) */}
//                     <div className="hidden md:block">
//                         <div className="ml-10 flex items-baseline space-x-8">
//                             <Link
//                                 to="/"
//                                 className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${isActive('/') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
//                                     }`}
//                             >
//                                 Home
//                             </Link>
//                             {/* <Link
//                                 to="/about"
//                                 className={`px-3 py-2 text-lg font-poppins font-semibold  transition duration-300 ${isActive('/about') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
//                                     }`}
//                             >
//                                 About
//                             </Link> */}
//                             <Link
//   to="#"
//   onClick={(e) => {
//     e.preventDefault();
//     if (onAboutClick) onAboutClick();
//   }}
//   className="px-3 py-2 text-lg font-poppins font-semibold transition duration-300 text-gray-700 hover:text-gray-900"
// >
//   About
// </Link>

//                             <Link
//                                 to="/analyze-skin-tone"
//                                 className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${isActive('/analyze-skin-tone') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
//                                     }`}
//                             >
//                                 Analyze Skin Tone
//                             </Link>
//                             <Link
//                                 to="/outfit-recommendation"
//                                 className={`px-3 py-2 text-lg font-poppins font-semibold  transition duration-300 ${isActive('/outfit-recommendation') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
//                                     }`}
//                             >
//                                 Outfit Recommendation
//                             </Link>
//                             <Link
//                                 to="/identify-skin-tone"
//                                 className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${isActive('/identify-skin-tone') ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-700 hover:text-gray-900'
//                                     }`}
//                             >
//                                 Identify Skin Tone
//                             </Link>
//                         </div>
//                     </div>

//                     {/* Right - Login Button (Desktop) */}
//                     <div className="hidden md:block">
//                         <Link
//                             to="/login"
//                             className="bg-gray-800 text-white px-6 py-2 mr-10 rounded-md text-lg font-poppins font-semibold  hover:bg-gray-700 transition duration-300"
//                         >
//                             Login
//                         </Link>
//                     </div>

//                     {/* Mobile menu button */}
//                     <div className="md:hidden">
//                         <button
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                             className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 p-2"
//                         >
//                             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Mobile Menu */}
//             {isMenuOpen && (
//                 <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
//                     <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//                         <Link
//                             to="/"
//                             className={`block px-3 py-2 text-base font-medium border-b ${isActive('/') ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:text-gray-900'
//                                 }`}
//                             onClick={() => setIsMenuOpen(false)}
//                         >
//                             Home
//                         </Link>
//                         <Link
//                             to="/about"
//                             className={`block px-3 py-2 text-base font-medium border-b ${isActive('/about') ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:text-gray-900'
//                                 }`}
//                             onClick={() => setIsMenuOpen(false)}
//                         >
//                             About
//                         </Link>
//                         <Link
//                             to="/analyze-skin-tone"
//                             className={`block px-3 py-2 text-base font-medium border-b ${isActive('/analyze-skin-tone') ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:text-gray-900'
//                                 }`}
//                             onClick={() => setIsMenuOpen(false)}
//                         >
//                             Analyze Skin Tone
//                         </Link>
//                         <Link
//                             to="/outfit-recommendation"
//                             className={`block px-3 py-2 text-base font-medium border-b ${isActive('/outfit-recommendation') ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:text-gray-900'
//                                 }`}
//                             onClick={() => setIsMenuOpen(false)}
//                         >
//                             Outfit Recommendation
//                         </Link>
//                         <Link
//                             to="/identify-skin-tone"
//                             className={`block px-3 py-2 text-base font-medium border-b ${isActive('/identify-skin-tone') ? 'text-gray-900 bg-gray-50' : 'text-gray-700 hover:text-gray-900'
//                                 }`}
//                             onClick={() => setIsMenuOpen(false)}
//                         >
//                             Identify Skin Tone
//                         </Link>
//                         <div className="px-3 py-4 border-t">
//                             <Link
//                                 to="/login"
//                                 className="w-full bg-gray-800 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-300 block text-center"
//                                 onClick={() => setIsMenuOpen(false)}
//                             >
//                                 Login
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </nav>
//     );
// };

// export default Navbar;
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ onAboutClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleAboutClick = (e) => {
    e.preventDefault();
    if (onAboutClick) onAboutClick();
    setIsMenuOpen(false); // close mobile menu if open
  };

  return (
    <nav className="fixed top-0 p-4 left-0 w-full bg-[#E5C19F]/50 shadow-lg z-50 backdrop-blur-md border-black/50 border-b-[5px]">
      <div className="w-full px-6">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-3xl ml-10 font-abril font-bold text-gray-800 hover:text-gray-600"
            >
              Coloryze
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${
                  isActive("/")
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Home
              </Link>

              {/* ✅ Smooth scroll About */}
              <a
                href="#about"
                onClick={handleAboutClick}
                className="px-3 py-2 text-lg font-poppins font-semibold transition duration-300 text-gray-700 hover:text-gray-900"
              >
                About
              </a>

              <Link
                to="/analyze-skin-tone"
                className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${
                  isActive("/analyze-skin-tone")
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Analyze Skin Tone
              </Link>

              <Link
                to="/outfit-recommendation"
                className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${
                  isActive("/outfit-recommendation")
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Outfit Recommendation
              </Link>

              <Link
                to="/identify-skin-tone"
                className={`px-3 py-2 text-lg font-poppins font-semibold transition duration-300 ${
                  isActive("/identify-skin-tone")
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Identify Skin Tone
              </Link>
            </div>
          </div>

          {/* Login Button (Desktop) */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="bg-gray-800 text-white px-6 py-2 mr-10 rounded-md text-lg font-poppins font-semibold hover:bg-gray-700 transition duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 p-2"
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
      </div>

      {/* ✅ Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium border-b ${
                isActive("/")
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* ✅ Smooth scroll About in mobile too */}
            <a
              href="#about"
              onClick={handleAboutClick}
              className="block px-3 py-2 text-base font-medium border-b text-gray-700 hover:text-gray-900"
            >
              About
            </a>

            <Link
              to="/analyze-skin-tone"
              className={`block px-3 py-2 text-base font-medium border-b ${
                isActive("/analyze-skin-tone")
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Analyze Skin Tone
            </Link>

            <Link
              to="/outfit-recommendation"
              className={`block px-3 py-2 text-base font-medium border-b ${
                isActive("/outfit-recommendation")
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Outfit Recommendation
            </Link>

            <Link
              to="/identify-skin-tone"
              className={`block px-3 py-2 text-base font-medium border-b ${
                isActive("/identify-skin-tone")
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-700 hover:text-gray-900"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Identify Skin Tone
            </Link>

            <div className="px-3 py-4 border-t">
              <Link
                to="/login"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition duration-300 block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
