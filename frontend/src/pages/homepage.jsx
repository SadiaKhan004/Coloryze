
// import React from "react";
// import { motion } from "framer-motion";

// const HomePage = () => {
//     // Animation variants for text
//     const textVariant = {
//         hidden: { opacity: 0, y: 40 },
//         visible: (delay = 0) => ({
//             opacity: 1,
//             y: 0,
//             transition: { duration: 1.2, delay, ease: "easeOut" },
//         }),
//     };

//     // Animation for image
//     const imageVariant = {
//         hidden: { opacity: 0, scale: 1.05 },
//         visible: {
//             opacity: 1,
//             scale: 1,
//             transition: { duration: 1.5, ease: "easeOut" },
//         },
//     };

//     return (
//         <div className="bg-[#FAE8D4] w-screen h-screen absolute left-0 top-0 overflow-x-hidden">
//             {/* Text Content with animation */}
//             <motion.div
//                 className="absolute top-52 left-5 sm:top-20 sm:left-10 md:top-32 md:left-20 lg:top-40 lg:left-40 z-30 max-w-[90vw]"
//                 initial="hidden"
//                 animate="visible"
//             >
//                 <motion.h1
//                     variants={textVariant}
//                     custom={0.2}
//                     className="w-full leading-[60px] text-left font-abril text-[50px] lg:w-[700px] md:w-[600px] sm:[500px] sm:text-[50px] md:text-[70px] lg:text-[90px] text-black font-medium lg:leading-[100px] tracking-wider"
//                 >
//                     Where your colors come to life
//                 </motion.h1>

//                 <motion.p
//                     variants={textVariant}
//                     custom={0.6}
//                     className="w-full text-left font-poppins tracking-wider mt-4 text-2xl lg:w-[700px] md:w-[600px] sm:[500px] sm:mt-6 md:mt-8 lg:mt-10 leading-relaxed text-lg sm:text-xl md:text-2xl lg:text-5xl text-black"
//                 >
//                     Experience fashion that harmonizes with your essence
//                 </motion.p>
//             </motion.div>

//             {/* Right Fixed Image with motion */}
//             <motion.div
//                 className="absolute top-10 right-0 w-full sm:w-3/4 md:w-2/3 lg:w-[850px] h-full z-10 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8),0_5px_10px_rgba(0,0,0,0.5)]"
//                 variants={imageVariant}
//                 initial="hidden"
//                 animate="visible"
//             >
//                 <img
//                     className="w-full h-full object-cover filter brightness-75 contrast-110"
//                     src="/final.png"
//                     alt="Colorful background"
//                 />
//                 <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.4)] pointer-events-none"></div>
//             </motion.div>
//         </div>
//     );
// };

// export default HomePage;
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Palette, Brain } from "lucide-react";

export default function HomePage() {
  const textVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, delay, ease: "easeOut" },
    }),
  };

  const fadeVariant = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-[#f8f4ff] via-[#fef6f9] to-[#e9f6ff] text-gray-900 flex items-center justify-center">
      
      {/* Floating AI-inspired blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#d1c4e9] opacity-30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-72 h-72 bg-[#b3e5fc] opacity-30 blur-3xl rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 left-1/4 w-56 h-56 bg-[#f48fb1] opacity-25 blur-3xl rounded-full animate-pulse delay-700"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ffe082] opacity-20 blur-3xl rounded-full animate-pulse delay-1000"></div>

      {/* Centered content */}
      <motion.div
        className="relative z-20 text-center px-6 md:px-20"
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={textVariant}
          custom={0.2}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-tight font-['Playfair_Display']"
        >
          Style That Suits You,
          <br />
          <span className="bg-gradient-to-r from-[#9b6ef3] via-[#e65ba0] to-[#50b8e7] bg-clip-text text-transparent">
            Powered by AI
          </span>
        </motion.h1>

        <motion.p
          variants={textVariant}
          custom={0.6}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-800 font-light leading-relaxed"
        >
          Discover your unique color palette through intelligent AI analysis. 
          From analyzing your tone to finding matching outfits — fashion meets technology.
        </motion.p>

        <motion.div
          variants={textVariant}
          custom={1.0}
          className="mt-10 flex flex-wrap justify-center gap-6"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-[#b388ff] to-[#81d4fa] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition">
            Get Started
          </button>
          <button className="px-8 py-3 bg-white/70 backdrop-blur-md text-gray-700 border border-gray-200 rounded-full hover:bg-white hover:scale-105 transition">
            Learn More
          </button>
        </motion.div>
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        className="absolute bottom-40 left-4/3 -translate-x-1/2 flex gap-6 opacity-80"
        variants={fadeVariant}
        initial="hidden"
        animate="visible"
      >
        <Sparkles size={30} className="text-[#b388ff] animate-bounce" />
        <Palette size={30} className="text-[#81d4fa] animate-bounce delay-500" />
        <Brain size={30} className="text-[#f48fb1] animate-bounce delay-1000" />
      </motion.div>
    </div>
  );
}
