

// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const UploadSection = ({
//   onFileSelect,
//   onDrop,
//   onDragOver,
//   onDragLeave,
//   isDragging,
//   selectedImage,
//   uploadStatus,
//   resetAll,
// }) => {
//   return (
//     <motion.div
//       onDragOver={onDragOver}
//       onDragLeave={onDragLeave}
//       onDrop={onDrop}
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.8, ease: "easeOut" }}
//       className={`relative -top-6 overflow-hidden py-2 px-12 rounded-3xl text-center transition-all duration-700 
//         ${isDragging ? "bg-[#fff5ec] shadow-[0_0_40px_rgba(255,220,180,0.6)]" : "bg-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(183,122,84,0.15)]"}
//       `}
//     >
//       {/* === Floating gradient blobs (Copilot vibe) === */}
//       <motion.div
//         className="absolute w-64 h-64 bg-gradient-to-br from-[#B77A54] via-[#ffcf99] to-[#ffd6b5] rounded-full blur-3xl opacity-30 -top-20 -left-20"
//         animate={{
//           x: [0, 30, 0, -30, 0],
//           y: [0, -20, 0, 20, 0],
//         }}
//         transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
//       />
//       <motion.div
//         className="absolute w-72 h-72 bg-gradient-to-tr from-[#FFD6B5] via-[#B77A54] to-[#ffcf99] rounded-full blur-3xl opacity-25 -bottom-24 right-0"
//         animate={{
//           x: [0, -40, 0, 20, 0],
//           y: [0, 20, 0, -20, 0],
//         }}
//         transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
//       />

//       {/* === Glowing central AI orb / ring === */}
//       <motion.div
//         className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br from-[#ffcf99]/20 to-[#B77A54]/10 blur-2xl"
//         animate={{
//           scale: [1, 1.05, 1],
//           opacity: [0.4, 0.6, 0.4],
//         }}
//         transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
//       />
//       <motion.div
//         className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-[#B77A54]/30 shadow-[0_0_40px_rgba(183,122,84,0.3)]"
//         animate={{
//           rotate: [0, 360],
//         }}
//         transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
//       />

//       <AnimatePresence>
//         {!selectedImage ? (
//           <motion.div
//             key="upload-empty"
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 0.6 }}
//             className="relative z-10"
//           >
//             {/* Floating illustration (replace path) */}
//             <motion.img
//               src="/imageupload.png" // 🌸 replace with your AI-style illustration
//               alt="AI Upload"
//               className="mx-auto w-28 h-28 mt-5 mb-6 opacity-90 pointer-events-none"
//               animate={{
//                 y: [0, -10, 0],
//                 scale: [1, 1.02, 1],
//                 rotate: [0, 1, -1, 0],
//               }}
//               transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
//             />

//             <p className="text-xl font-semibold text-[#744C33] mb-4">
//               Drop your image here or choose a file
//             </p>
//             <p className="text-sm text-gray-600 mb-6">Max size 5MB — Supported formats: JPG, PNG</p>

//             <motion.label
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.98 }}
//               className="bg-gradient-to-r from-[#B77A54] via-[#ffcf99] to-[#B77A54] px-8 py-3 rounded-full cursor-pointer text-white font-semibold shadow-md hover:shadow-lg transition-all inline-block"
//             >
//               Choose File
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={onFileSelect}
//               />
//             </motion.label>
//           </motion.div>
//         ) : (
//           <motion.div
//             key="upload-preview"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.6 }}
//             className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8"
//           >
//             <motion.img
//               src={selectedImage}
//               alt="uploaded"
//               className="w-48 h-48 object-cover rounded-2xl shadow-lg border-2 border-[#B77A54]"
//               whileHover={{ scale: 1.05 }}
//             />
//             <div className="text-left">
//               <p className="font-semibold text-[#744C33] text-lg mb-1">Image ready!</p>
//               <p className="text-sm text-gray-600">{uploadStatus}</p>
//               <motion.button
//                 onClick={resetAll}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 className="mt-5 px-5 py-2 rounded-full bg-gradient-to-r from-[#ffcf99] to-[#B77A54] text-white font-medium shadow-md hover:shadow-lg transition-all"
//               >
//                 Reset
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default UploadSection;
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const UploadSection = ({ 
  onFileSelect, 
  isDragging, 
  setIsDragging, 
  selectedImage, 
  resetAll 
}) => {

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) onFileSelect(file);
      }}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative overflow-hidden w-[750px] mt-28 py-12 px-12 rounded-3xl text-center transition-all duration-700 
        ${isDragging ? "bg-[#fff5ec] shadow-[0_0_40px_rgba(255,220,180,0.6)]" : "bg-white/70 backdrop-blur-xl shadow-[0_0_30px_rgba(183,122,84,0.15)]"}
      `}
    >
      {/* Floating background blobs */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-br from-[#B77A54] via-[#ffcf99] to-[#ffd6b5] rounded-full blur-3xl opacity-30 -top-20 -left-20"
        animate={{ x: [0, 30, 0, -30, 0], y: [0, -20, 0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-tr from-[#FFD6B5] via-[#B77A54] to-[#ffcf99] rounded-full blur-3xl opacity-25 -bottom-24 right-0"
        animate={{ x: [0, -40, 0, 20, 0], y: [0, 20, 0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      <AnimatePresence>
        {!selectedImage ? (
          <motion.div
            key="upload-empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.img
              src="/imageupload.png" // Replace with your illustration
              alt="AI Upload"
              className="mx-auto w-28 h-28 mt-5 mb-6 opacity-90 pointer-events-none"
              animate={{ y: [0, -10, 0], scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />
            <p className="text-xl font-semibold text-[#744C33] mb-2">Drop your image here or choose a file</p>
            <p className="text-sm text-gray-600 mb-6">Max size 5MB — JPG, PNG supported</p>

            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#B77A54] via-[#ffcf99] to-[#B77A54] px-8 py-3 rounded-full cursor-pointer text-white font-semibold shadow-md hover:shadow-lg transition-all inline-block"
            >
              Choose File
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onFileSelect(file);
                }}
              />
            </motion.label>
          </motion.div>
        ) : (
          <motion.div
            key="upload-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <motion.img
              src={selectedImage}
              alt="uploaded"
              className="w-48 h-48 object-cover rounded-2xl shadow-lg border-2 border-[#B77A54]"
              whileHover={{ scale: 1.05 }}
            />
            <div className="text-left">
              <p className="font-semibold text-[#744C33] text-lg mb-1">Image ready!</p>
              <motion.button
                onClick={resetAll}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-5 px-5 py-2 rounded-full bg-gradient-to-r from-[#ffcf99] to-[#B77A54] text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                Reset
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadSection;
