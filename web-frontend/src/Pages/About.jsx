import React, { useEffect, useState } from "react";
import bg from "../assets/background.jpg";
import ProgressCircles from "../Components/Progress/ProgressCircles";
import AboutContent from "../Partials/Sections/About/AboutContent";

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
    <div style={{ height: totalScrollHeight }}>
      <div className="fixed z-10 top-0 left-0 min-w-screen min-h-screen max-h-screen pt-20 px-14">
        <div className="absolute z-0 top-0 left-0 w-full h-full">
          {/* <img src={bg} className="w-full h-full" /> */}
        </div>

        <ProgressCircles
          scrollY={scrollY}
          totalScrollHeight={totalScrollHeight}
          numCircles={numCircles}
        />

        <AboutContent
          scrollPos={scrollY}
          totalScrollHeight={totalScrollHeight}
        />
      </div>
    </div>
  );
};

export default About;
