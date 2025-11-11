// import React from "react";

// const ResultCard = ({ aiResult, selectedImage, monk_hex }) => {
//   if (!aiResult) return null;

//   return (
//     <div className="mt-8 bg-white p-6 rounded-lg shadow">
//       <h2 className="text-xl font-semibold mb-3">Skin Tone Analysis</h2>
//       <div className="flex gap-6">
//         {selectedImage && <img src={selectedImage} alt="preview" className="w-36 h-36 object-cover rounded" />}
//         <div className="flex-1">
//           <p><strong>Skin Tone:</strong> {aiResult.skin_tone}</p>
//           <p><strong>Descriptor:</strong> {aiResult.descriptor}</p>
//           <p><strong>Tone Group:</strong> {aiResult.tone_group}</p>
//           <p><strong>Undertone:</strong> {aiResult.undertone}</p>
//           <p><strong>Eye Color:</strong> {Array.isArray(aiResult.eye_color) ? aiResult.eye_color.join(" and ") : aiResult.eye_color}</p>
//           <p><strong>Hair Color:</strong> {aiResult.hair_color}</p>

//           <div className="mt-4 flex items-center gap-4">
//             <div
//               className="w-12 h-12 rounded-full border"
//               style={{
//                 backgroundColor: (() => {
//                   try {
//                     const idx = parseInt((aiResult.skin_tone || "").replace(/[^0-9]/g, ""), 10) || 1;
//                     return monk_hex[idx] || "#ffffff";
//                   } catch {
//                     return "#ffffff";
//                   }
//                 })()
//               }}
//             />
//             <span className="text-sm text-gray-600">Skin tone swatch</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultCard;
import React from "react";
import { motion } from "framer-motion";

const ResultCard = ({ aiResult, selectedImage, monk_hex }) => {
  if (!aiResult) return null;

  const toneColor = (() => {
    try {
      const idx = parseInt((aiResult.skin_tone || "").replace(/[^0-9]/g, ""), 10) || 1;
      return monk_hex[idx] || "#f8e8e2";
    } catch {
      return "#f8e8e2";
    }
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-[90%] max-w-6xl rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/70 border border-white/40 shadow-[0_8px_40px_rgba(0,0,0,0.08)] mt-16"
    >
      {/* Soft border glow based on tone */}
      <div
        className="absolute top-0 left-0 w-full h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${toneColor}80, #ffffff40, ${toneColor}80)`,
        }}
      />

      <div className="flex flex-col md:flex-row items-stretch">
        {/* LEFT — Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="md:w-1/2 w-full relative overflow-hidden"
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Uploaded"
              className="w-full h-full object-cover object-center"
            />
          )}
          {/* Soft right fade for separation */}
          <div className="absolute right-0 inset-y-0 w-10 bg-gradient-to-l from-white/70 to-transparent pointer-events-none"></div>
        </motion.div>

        {/* RIGHT — Textual Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="md:w-1/2 w-full p-10 flex flex-col justify-center items-center text-center"
        >
          {/* Elegant shimmer header */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#BCAAA4] via-[#795548] to-[#5D4037]"
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          >
            Skin Tone Analysis
          </motion.h2>

          {/* Minimalist highlight section */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { label: "Skin Tone", value: aiResult.skin_tone },
              { label: "Undertone", value: aiResult.undertone },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-5 rounded-2xl shadow-inner backdrop-blur-sm bg-white/50 border border-pink-100 w-40 h-36"
              >
                <p className="text-sm uppercase text-gray-500 tracking-wider">
                  {item.label}
                </p>
                <p className="text-2xl font-semibold text-[#C86B85] mt-2">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Soft tone swatch */}
          <div className="flex flex-col items-center mt-4">
            <div
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              style={{
                backgroundColor: toneColor,
                boxShadow: `0 0 40px ${toneColor}90`,
              }}
            />
            <p className="text-sm text-gray-500 mt-3">
              AI-detected core skin tone hue
            </p>
          </div>

          {/* Subtle descriptor list */}
          <div className="mt-8 text-gray-700 text-sm leading-relaxed space-y-2 w-full max-w-sm border-t pt-5">
            <p>
              <span className="font-medium text-pink-600">Descriptor:</span>{" "}
              {aiResult.descriptor}
            </p>
            <p>
              <span className="font-medium text-pink-600">Tone Group:</span>{" "}
              {aiResult.tone_group}
            </p>
            <p>
              <span className="font-medium text-pink-600">Eye Color:</span>{" "}
              {Array.isArray(aiResult.eye_color)
                ? aiResult.eye_color.join(" and ")
                : aiResult.eye_color}
            </p>
            <p>
              <span className="font-medium text-pink-600">Hair Color:</span>{" "}
              {aiResult.hair_color}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
