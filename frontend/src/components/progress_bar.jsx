import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const progressMessages = [
  "Upload successful — preparing your image...",
  "Analyzing your skin tone and undertones...",
  "Extracting color palette — finding what flatters you most...",
  "Matching your seasonal color family...",
  "Personalizing your recommendations...",
  "Almost done — finalizing your results..."
];

const AnimatedProgressBar = ({ progress }) => {
  const [message, setMessage] = useState(progressMessages[0]);
  const starControls = useAnimation();

  useEffect(() => {
    if (progress < 20) setMessage(progressMessages[0]);
    else if (progress < 40) setMessage(progressMessages[1]);
    else if (progress < 60) setMessage(progressMessages[2]);
    else if (progress < 80) setMessage(progressMessages[3]);
    else if (progress < 95) setMessage(progressMessages[4]);
    else setMessage(progressMessages[5]);
  }, [progress]);

  useEffect(() => {
    starControls.start({
      opacity: [0, 1, 0],
      scale: [0.8, 1.2, 0.8],
      y: [0, -8, 0],
      transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
    });
  }, [starControls]);

  return (
    <div className="relative text-center z-20">
      <motion.div
        key={`${message}-${progress}`} // ✅ unique key
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-3"
      >
        <p className="text-2xl text-[#B77A54] font-semibold font-abril tracking-wider">
          {message}
        </p>
      </motion.div>

      <motion.img
        src="/stars.png"
        alt="Magic sparkle"
        animate={starControls}
        className="mx-auto mb-4 w-28 mt-20 h-28 z-30 pointer-events-none"
        style={{
          filter:
            "drop-shadow(0 0 15px rgba(0, 200, 255, 0.7)) drop-shadow(0 0 25px rgba(255, 180, 120, 0.6))",
        }}
      />

      <div className="relative mt-20 z-10 h-4 w-full max-w-2xl mx-auto rounded-full overflow-hidden bg-gray-200 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut", duration: 0.4 }}
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#B77A54] via-[#ffcf99] to-[#B77A54] shadow-[0_0_10px_#B77A54]"
        />
      </div>

      <motion.div
        key={`percent-${progress}`} // ✅ unique key here too
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-2"
      >
        <p className="text-md text-poppins text-gray-500">
          {Math.round(progress)}% complete
        </p>
      </motion.div>
    </div>
  );
};

export default AnimatedProgressBar;
