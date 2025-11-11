// import React from "react";

// const OutfitRecommendations = ({ outfits }) => {
//   if (!outfits?.length) return null;

//   return (
//     <div className="mt-6 bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold mb-3">Outfit Recommendations</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {outfits.map((g, idx) => (
//           <div key={idx} className="border rounded p-3 flex gap-3">
//             {g.img && <img src={g.image_url} alt="garment" className="w-28 h-28 object-contain rounded" />}
//             <div>
//               <a href={g.url || g.href} target="_blank" rel="noreferrer" className="text-[#B77A54] font-semibold">
//                 View item
//               </a>
//               <p className="text-sm text-gray-600">Distance: {Math.round((g.distance || 0) * 100) / 100}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OutfitRecommendations;
// import React from "react";

// const OutfitRecommendations = ({ outfits }) => {
//   if (!outfits?.length) return null;

//   return (
//     <div className="mt-6 bg-white p-6 rounded shadow">
//       <h2 className="text-xl font-semibold mb-3">Outfit Recommendations</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {outfits.map((g, idx) => (
//           <div
//             key={idx}
//             className="border rounded p-3 flex gap-3 hover:shadow-md transition-shadow duration-200"
//           >
//             <div className="flex-shrink-0">
//               {g.image_url ? (
//                 <img
//                   src={g.image_url}
//                   alt="garment"
//                   className="w-28 h-28 object-cover rounded-md border"
//                 />
//               ) : (
//                 <div className="w-28 h-28 flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-md border">
//                   No Image
//                 </div>
//               )}
//             </div>

//             <div className="flex flex-col justify-center">
//               <a
//                 href={g.url || g.href}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-[#B77A54] font-semibold hover:underline"
//               >
//                 View Item
//               </a>
//               <p className="text-sm text-gray-600 mt-1">
//                 Color Match Distance:{" "}
//                 <span className="font-medium text-gray-800">
//                   {Math.round((g.distance || 0) * 100) / 100}
//                 </span>
//               </p>
//               {g.color && (
//                 <div className="mt-2 flex items-center gap-2">
//                   <span className="text-sm text-gray-500">Matched Color:</span>
//                   <span
//                     className="w-5 h-5 rounded-full border"
//                     style={{ backgroundColor: g.color }}
//                   ></span>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OutfitRecommendations;
import React from "react";
import { motion } from "framer-motion";

const OutfitRecommendations = ({ outfits }) => {
  if (!outfits?.length) return null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay, ease: "easeOut" },
    }),
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#f8f4ff] via-[#fef6f9] to-[#e9f6ff] text-gray-900 py-16 px-8 md:px-20">
      {/* Floating pastel blobs for depth */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#b388ff] opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-80 h-80 bg-[#81d4fa] opacity-25 blur-3xl rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-[#f48fb1] opacity-20 blur-3xl rounded-full animate-pulse delay-700"></div>

      {/* Title */}
      <motion.h2
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="relative z-20 text-4xl md:text-5xl font-semibold text-center mb-12 text-[#b57ae0] font-['Playfair_Display']"
      >
        Outfit & Try-On Showcase
      </motion.h2>

      {/* Two-Column Layout */}
      <div className="relative z-20 grid md:grid-cols-2 gap-12">
        {/* Try-On Section */}
        <motion.div
          variants={fadeInUp}
          custom={0.3}
          initial="hidden"
          animate="visible"
          className="backdrop-blur-2xl bg-white/20 border border-white/40 rounded-3xl shadow-2xl p-6 h-[600px] overflow-y-auto hover:shadow-[0_0_25px_rgba(179,136,255,0.3)] transition-all duration-500"
        >
          <h3 className="text-2xl font-semibold text-center mb-6 text-[#a879e6]">
            Virtual Try-Ons
          </h3>

          <div className="flex flex-col items-center gap-6">
            {outfits.map((g, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                custom={idx * 0.1}
                initial="hidden"
                animate="visible"
                className="w-full flex flex-col items-center bg-white/50 backdrop-blur-md rounded-2xl shadow-md p-4 hover:scale-[1.02] hover:shadow-lg transition"
              >
                {g.tryon_image_base64 ? (
                  <img
                    src={g.tryon_image_base64}
                    alt={`Try-On ${idx + 1}`}
                    className="w-60 h-60 object-cover rounded-2xl border border-gray-200"
                  />
                ) : (
                  <div className="w-60 h-60 flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-2xl border border-gray-200">
                    No Try-On
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-600 font-medium">
                  Look {idx + 1}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Outfit Section */}
        <motion.div
          variants={fadeInUp}
          custom={0.6}
          initial="hidden"
          animate="visible"
          className="backdrop-blur-2xl bg-white/20 border border-white/40 rounded-3xl shadow-2xl p-6 h-[600px] overflow-y-auto hover:shadow-[0_0_25px_rgba(129,212,250,0.3)] transition-all duration-500"
        >
          <h3 className="text-2xl font-semibold text-center mb-6 text-[#6eb9f2]">
            Recommended Outfits
          </h3>

          <div className="flex flex-col gap-6">
            {outfits.map((g, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                custom={idx * 0.1}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row items-center gap-4 bg-white/50 backdrop-blur-md rounded-2xl shadow-md p-4 hover:scale-[1.02] hover:shadow-lg transition"
              >
                {g.image_url ? (
                  <img
                    src={g.image_url}
                    alt={`Outfit ${idx + 1}`}
                    className="w-36 h-36 object-cover rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center bg-gray-100 text-gray-500 text-sm rounded-xl border border-gray-200">
                    No Image
                  </div>
                )}

                <div className="flex flex-col justify-center text-center md:text-left">
                  <a
                    href={g.url || g.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#b77ae0] font-semibold hover:underline text-lg"
                  >
                    View Item
                  </a>
                  <p className="text-sm text-gray-700 mt-1">
                    Match Distance:{" "}
                    <span className="font-medium">
                      {Math.round((g.distance || 0) * 100) / 100}
                    </span>
                  </p>
                  {g.color && (
                    <div className="mt-2 flex items-center gap-2 justify-center md:justify-start">
                      <span className="text-sm text-gray-600">Matched Color:</span>
                      <span
                        className="w-6 h-6 rounded-full border shadow-inner"
                        style={{ backgroundColor: g.color }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OutfitRecommendations;
