import React from 'react';
import { motion } from "framer-motion";

const About = () => {
    const textVariant = {
    hidden: { opacity: 0, x: -80 },
    visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const imageVariant = {
    hidden: { opacity: 0, x: 80, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 1.2, ease: "easeOut", delay: 0.2 },
    },
    float: {
      y: [0, -15, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

    return (
        <div className="min-h-screen bg-[#FAE8D4] flex flex-col lg:flex-row items-center justify-start lg:justify-between w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
            {/* Text Content - Left Aligned */}
            <motion.div
                className="w-full relative left-20 lg:w-3/2 space-y-6 text-left max-w-2xl"
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-abril font-bold text-gray-900 tracking-wider">
                    Discover Your True Colors
                </h1>
                <p className="text-base italic  sm:text-lg lg:text-2xl text-gray-700 font-poppins leading-relaxed">
                    <span className="font-semibold">Coloryze</span> is your personal color companion, powered by smart AI and inspired by real beauty. let Coloryze unveil the shades that bring out your natural glow, confidence, and individuality. From
                    <span className="text-[#B17B59] font-semibold"> Warm Spring</span> to{" "}
                    <span className="text-[#B17B59] font-semibold"> Cool Winter</span>.
                    discover the colors that harmonize with you!
                </p>
                <p className="text-base italic sm:text-lg lg:text-4xl text-gray-700 font-elegant leading-relaxed">
                     <span className="text-[#B17B59] font-semibold">your skin tone, your energy, your style.</span>
                </p>
            </motion.div>

            {/* Image Content */}
           <motion.div
        className="w-full lg:w-1/2 flex justify-center mt-12 lg:mt-0 perspective-1000"
        variants={imageVariant}
        initial="hidden"
        animate={["visible", "float"]}
      >
        {/* <motion.img
          src="/colors2.jpg"
          alt=""
          className="w-[900px] lg:w-[1150px] xl:w-[1050px] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] object-cover cursor-pointer"
          whileHover={{
            rotateY: 180,
            transition: { duration: 1.2, ease: "easeInOut" },
          }}
        // /> */}

       <motion.img
            src="/colors2.jpg"
            alt="Color palette"
            className="w-full max-w-[800px] h-[550px] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] object-cover cursor-pointer"
            whileHover={{
                rotateY: 180,
                transition: { duration: 1.2, ease: "easeInOut" },
            }}
        />
      </motion.div>
        </div>
    );
};

export default About;