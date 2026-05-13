import React, { useRef } from "react";
import { motion } from "framer-motion";

import HomePage from "./homepage";
import About from "./About";
import Navbar from "../components/navbar";

const LandingPage = () => {
  const aboutRef = useRef(null);

  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative bg-[#FAE8D4]">
      <Navbar onAboutClick={scrollToAbout} />
      <section id="home" className="h-screen">
        <HomePage />
      </section>
      <section ref={aboutRef} id="about">
        <About />
      </section>
    </div>
  );
};

export default LandingPage;
