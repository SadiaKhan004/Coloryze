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
