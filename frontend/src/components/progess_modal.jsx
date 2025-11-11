import React, { useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import AnimatedProgressBar from "./progress_bar";

const ProgressModal = ({ show, progress }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (show) {
      // Sequential fade-in of elements
      const sequence = async () => {
        await controls.start("visible");
      };
      sequence();
    }
  }, [show, controls]);

  const variants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-12 max-w-xl h-[500px] w-[90%] text-center"
          >
            <AnimatedProgressBar progress={progress} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressModal;
