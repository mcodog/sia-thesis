import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "../../../assets/images/logo.png";
import graphic from "../../../assets/images/graphic1.png";
import man from "../../../assets/images/man.png";

const AboutContent = ({ scrollPos, totalScrollHeight }) => {
  const sections = [
    {
      image: logo,
    },
    {
      name: "How It Works",
    },
    {
      name: "Meet the Team",
      team: [
        {
          name: "Mark Codog",
          role: "Lead Developer",
          image: man,
        },
        {
          name: "Glaiza Marie Arcibal",
          role: "Fullstack Developer",
          image: man,
        },
        {
          name: "Bhea Marie Cervantes",
          role: "Frontend Developer",
          image: man,
        },
      ],
    },
    {
      title: "",
      content: "",
    },
  ];

  const totalSections = sections.length;
  const sectionHeight = totalScrollHeight / totalSections;
  const currentSection = Math.min(
    Math.floor((scrollPos * 1.1) / sectionHeight),
    totalSections - 1
  );

  // Determine which team member should be enlarged based on scroll position
  const getEnlargedTeamMember = () => {
    if (sections[currentSection].team) {
      const teamSection = sections[currentSection];
      const teamLength = teamSection.team.length;

      // Calculate which team member should be enlarged based on 100 scroll pos intervals
      const baseScrollPos = (currentSection * sectionHeight) / 1.2; // Convert back to original scroll pos
      const relativeScrollPos = scrollPos - baseScrollPos;
      const intervalSize = 250;

      // Only return a valid index if we're within the appropriate scroll range
      const memberIndex = Math.floor(relativeScrollPos / intervalSize);

      // Return the index only if it's valid
      if (memberIndex >= 0 && memberIndex < teamLength) {
        return memberIndex;
      }
    }
    return -1; // No team member enlarged
  };

  const enlargedTeamMember = getEnlargedTeamMember();

  return (
    <div className="w-3/4 h-full flex justify-center items-center">
      <div className="h-full w-full flex justify-center items-center ">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 1, type: "spring" }}
          className="p-8 rounded-2xl bg-white right-0 w-full"
        >
          <p className="font-glacial font-bold text-4xl my-4">
            {sections[currentSection].title}
          </p>
          <p>{sections[currentSection].content}</p>
          {sections[currentSection].name === "How It Works" && (
            <div className="relative">
              <img className="w-full" src={graphic} alt="graphic" />
            </div>
          )}
          {sections[currentSection].image && (
            <div className="relative">
              <img
                className="w-full"
                src={sections[currentSection].image}
                alt="logo"
              />
            </div>
          )}

          {/* Display the team members when on "Meet the Team" section */}
          {sections[currentSection].team && (
            <div className="w-full relative h-96 flex items-center justify-center">
              <motion.div
                className="w-full flex justify-between items-center px-4"
                layout
              >
                {sections[currentSection].team.map((member, index) => {
                  // Calculate x offset for other cards when one is enlarged
                  const getXOffset = () => {
                    if (enlargedTeamMember === -1) return 0;

                    // If this card is before the enlarged one, move left
                    if (index < enlargedTeamMember) return -30;

                    // If this card is after the enlarged one, move right
                    if (index > enlargedTeamMember) return 30;

                    return 0;
                  };

                  const isEnlarged = enlargedTeamMember === index;

                  return (
                    <motion.div
                      key={index}
                      className="relative rounded-xl overflow-hidden shadow-custom w-full mx-1"
                      layout
                      initial={{ scale: 1, x: 0 }}
                      animate={{
                        scale: isEnlarged ? 1.2 : 1,
                        zIndex: isEnlarged ? 10 : 1,
                        x: getXOffset(),
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="h-64 w-full relative bg-gray-100">
                        <div className="absolute w-full h-64 overflow-hidden">
                          <motion.img
                            className="w-full"
                            src={member.image}
                            alt={member.name}
                            initial={{ filter: "grayscale(100%)" }}
                            animate={{
                              filter: isEnlarged
                                ? "grayscale(0%)"
                                : "grayscale(100%)",
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 pb-6"
                          initial={{ y: 20, opacity: 0.8 }}
                          animate={{
                            y: isEnlarged ? 0 : 20,
                            opacity: isEnlarged ? 1 : 0.8,
                          }}
                          transition={{
                            delay: isEnlarged ? 0.1 : 0,
                          }}
                        >
                          <h3 className="font-bold text-md">{member.name}</h3>
                          <p className="text-sm mt-2">{member.role}</p>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AboutContent;
