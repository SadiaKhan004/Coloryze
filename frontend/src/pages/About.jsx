// import React from 'react';
// import { motion } from "framer-motion";

// const About = () => {
//     const textVariant = {
//     hidden: { opacity: 0, x: -80 },
//     visible: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeOut" } },
//   };

//   const imageVariant = {
//     hidden: { opacity: 0, x: 80, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       x: 0,
//       scale: 1,
//       transition: { duration: 1.2, ease: "easeOut", delay: 0.2 },
//     },
//     float: {
//       y: [0, -15, 0],
//       transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
//     },
//   };

//     return (
//         <div className="min-h-screen bg-[#FAE8D4] flex flex-col lg:flex-row items-center justify-start lg:justify-between w-full px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
//             {/* Text Content - Left Aligned */}
//             <motion.div
//                 className="w-full relative left-20 lg:w-3/2 space-y-6 text-left max-w-2xl"
//                 initial={{ opacity: 0, x: -80 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 1, ease: "easeOut" }}
//             >
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-abril font-bold text-gray-900 tracking-wider">
//                     Discover Your True Colors
//                 </h1>
//                 <p className="text-base italic  sm:text-lg lg:text-2xl text-gray-700 font-poppins leading-relaxed">
//                     <span className="font-semibold">Coloryze</span> is your personal color companion, powered by smart AI and inspired by real beauty. let Coloryze unveil the shades that bring out your natural glow, confidence, and individuality. From
//                     <span className="text-[#B17B59] font-semibold"> Warm Spring</span> to{" "}
//                     <span className="text-[#B17B59] font-semibold"> Cool Winter</span>.
//                     discover the colors that harmonize with you!
//                 </p>
//                 <p className="text-base italic sm:text-lg lg:text-4xl text-gray-700 font-elegant leading-relaxed">
//                      <span className="text-[#B17B59] font-semibold">your skin tone, your energy, your style.</span>
//                 </p>
//             </motion.div>

//             {/* Image Content */}
//            <motion.div
//         className="w-full lg:w-1/2 flex justify-center mt-12 lg:mt-0 perspective-1000"
//         variants={imageVariant}
//         initial="hidden"
//         animate={["visible", "float"]}
//       >
//         {/* <motion.img
//           src="/colors2.jpg"
//           alt=""
//           className="w-[900px] lg:w-[1150px] xl:w-[1050px] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] object-cover cursor-pointer"
//           whileHover={{
//             rotateY: 180,
//             transition: { duration: 1.2, ease: "easeInOut" },
//           }}
//         // /> */}

//        <motion.img
//             src="/colors2.jpg"
//             alt="Color palette"
//             className="w-full max-w-[800px] h-[550px] rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] object-cover cursor-pointer"
//             whileHover={{
//                 rotateY: 180,
//                 transition: { duration: 1.2, ease: "easeInOut" },
//             }}
//         />
//       </motion.div>
//         </div>
//     );
// };

// export default About;
import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay, ease: "easeOut" },
    }),
  };

  const features = [
    {
      title: "Upload Your Photo",
      description:
        "Let our AI analyze your photo to detect your skin tone, hair, and eye color for accurate recommendations.",
    },
    {
      title: "Get Your Color Palette",
      description:
        "Receive a personalized color palette curated to complement your natural tones and style.",
    },
    {
      title: "Find Matching Outfits",
      description:
        "Discover outfits and accessories that match your palette across online stores with AI-powered suggestions.",
    },
  ];

  const useCases = [
    {
      title: "Online Shopping",
      description:
        "Avoid buying the wrong colors and reduce return rates by choosing outfits that truly suit you.",
    },
    {
      title: "Personal Styling",
      description:
        "Gain fashion confidence with AI-curated color recommendations for everyday or special events.",
    },
    {
      title: "Virtual Try-On",
      description:
        "Visualize how different colors look on you before making a purchase, making styling easier and fun.",
    },
  ];

  const cardBaseClasses =
    "p-6 rounded-3xl backdrop-blur-lg shadow-lg text-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl";

  return (
    <section
      id="about"
      className="relative w-full py-24 bg-gradient-to-br from-[#f8f4ff] via-[#fef6f9] to-[#e9f6ff] flex flex-col items-center overflow-hidden"
    >
      {/* Floating blobs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#d1c4e9] opacity-30 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#b3e5fc] opacity-30 blur-3xl rounded-full animate-pulse delay-500"></div>
      <div className="absolute bottom-10 left-1/3 w-56 h-56 bg-[#f48fb1] opacity-25 blur-3xl rounded-full animate-pulse delay-700"></div>

      {/* Section Header */}
      <motion.div
        className="text-center max-w-4xl mb-16 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About Coloryze
        </h2>
        <p className="text-gray-800 text-lg md:text-xl leading-relaxed">
          Coloryze is an AI-powered personal styling companion that helps you
          discover your perfect color palette, match outfits to your natural tones,
          and make confident fashion choices effortlessly.
        </p>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="max-w-6xl w-full px-6 mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h3 className="font-abril mt-4 tracking-wider text-3xl md:text-4xl font-bold text-black/80 mb-8 text-center">
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={`${cardBaseClasses} bg-gradient-to-br from-[#b388ff]/40 via-[#81d4fa]/30 to-[#f48fb1]/30`}
              variants={fadeInUp}
              custom={index * 0.2}
            >
              <h4 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h4>
              <p className="text-gray-700 text-base md:text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Use Cases */}
      <motion.div
        className="max-w-6xl w-full px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h3 className="font-abril tracking-wider text-3xl md:text-4xl font-bold text-black/80 mb-8 text-center">
          Use Cases
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              className={`${cardBaseClasses} bg-gradient-to-br from-[#ffe082]/40 via-[#f48fb1]/30 to-[#81d4fa]/30`}
              variants={fadeInUp}
              custom={index * 0.2}
            >
              <h4 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900">
                {useCase.title}
              </h4>
              <p className="text-gray-700 text-base md:text-lg">{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
