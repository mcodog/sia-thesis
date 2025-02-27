import React from "react";
import { motion } from "framer-motion";

const AboutContent = ({ scrollPos, totalScrollHeight }) => {
  const sections = [
    {
      title: "About Pathfinder",
      content:
        "Pathfinder is a simple yet powerful quiz that helps you discover the best counseling approach for your needs.",
    },
    {
      title: "How It Works",
      content:
        "Answer a few fun and engaging questions, and Pathfinder will match you with the counseling type best suited for you.",
    },
    {
      title: "Meet the Team",
      content:
        "Our dedicated team of mental health advocates and tech experts built Pathfinder to make counseling more accessible and understandable.",
    },
    {
      title: "Get Started Today",
      content:
        "Take the quiz now and find the counseling approach that fits you best!",
    },
  ];

  const totalSections = sections.length;
  const sectionHeight = totalScrollHeight / totalSections;
  const currentSection = Math.min(
    Math.floor(scrollPos / sectionHeight),
    totalSections - 1
  );

  return (
    <div className="absolute top-0 z-10 w-full h-full grid grid-cols-2 pt-20">
      <div className="h-full pl-20 flex flex-col justify-center">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 1, type: "spring" }}
          className="p-8 shadow-custom rounded-2xl bg-white"
        >
          <p className="font-glacial font-bold text-4xl my-4">
            {sections[currentSection].title}
          </p>
          <p>{sections[currentSection].content}</p>
        </motion.div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default AboutContent;
