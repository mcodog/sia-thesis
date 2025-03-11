import React, { useEffect, useState } from "react";
import bg from "../assets/background.jpg";
import ProgressCircles from "../Components/Progress/ProgressCircles";
import AboutContent from "../Partials/Sections/About/AboutContent";
import { motion } from "framer-motion";

// Main About Component
const About = () => {
  const [scrollY, setScrollY] = useState(0);
  const totalScrollHeight = 3000;
  const numCircles = 4;

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ height: totalScrollHeight }} className="relative overflow-y-auto scrollbar-right">
      {/* Background Image with Motion Effects */}
      <motion.div
        className="fixed top-0 left-0 w-full h-screen"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
      >
        <img src={bg} className="w-full h-full object-cover brightness-75" alt="background" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-900/50 via-transparent to-green-700/60"></div>
      </motion.div>

      {/* Animated Blobs - Multiple Floating Elements */}
      <motion.div
        className="fixed top-10 left-10 w-44 h-44 md:w-60 md:h-60 rounded-full bg-green-400 opacity-50 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-10 right-10 w-56 h-56 md:w-80 md:h-80 rounded-full bg-green-600 opacity-50 blur-3xl"
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-1/3 left-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-green-300 opacity-40 blur-2xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Floating Glow Effect */}
      <motion.div
        className="fixed top-0 right-0 w-32 h-32 md:w-44 md:h-44 rounded-full bg-green-500 opacity-40 shadow-2xl"
        animate={{ y: [0, 10, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />

      {/* Content Wrapper */}
      <div className="fixed z-10 top-0 left-0 w-full h-screen pt-20 px-14 flex flex-col items-center justify-center">
        {/* Progress Circles */}
        <ProgressCircles scrollY={scrollY} totalScrollHeight={totalScrollHeight} numCircles={numCircles} />

        {/* About Content */}
        <AboutContent scrollPos={scrollY} totalScrollHeight={totalScrollHeight} />
      </div>
    </div>
  );
};

export default About;
