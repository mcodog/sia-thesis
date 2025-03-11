import React from "react";
import { motion } from "framer-motion";


const AboutContent = ({ scrollPos, totalScrollHeight }) => {
  const sections = [
    {
      title: "About Pathfinder",
      content:
        "Pathfinder is a simple yet powerful quiz that helps you discover the best counseling approach for your needs. Whether you're seeking therapy, coaching, or self-help strategies, Pathfinder provides personalized recommendations to guide you toward the best mental health support.",
    },
    {
      title: "How It Works",
      content:
        "Answer a few fun and engaging questions, and Pathfinder will match you with the counseling type best suited for you. Our smart algorithm evaluates your responses and suggests therapy styles, such as cognitive behavioral therapy (CBT), mindfulness-based counseling, or career coaching, ensuring a perfect fit for your needs.",
    },
    {
      title: "Meet the Team",
      content:
        "Our dedicated team of mental health advocates and tech experts built Pathfinder to make counseling more accessible and understandable. We are passionate about bridging the gap between mental health resources and those who need them the most.",
      team: [
        {
          name: "Mark Codog",
          role: "Lead Psychologist",
          image: "/images/team1.jpg",
        },
        {
          name: "Glaiza Marie Arcibal",
          role: "Tech Lead",
          image: "/images/team2.jpg",
        },
        {
          name: "Bhea Marie Cervantes",
          role: "Community Manager",
          image: "/images/team3.jpg",
        },
      ],
    },
    {
      title: "Get Started Today",
      content:
        "Take the quiz now and find the counseling approach that fits you best! With just a few minutes of your time, you can gain insights into what type of support suits your personal growth journey. Start today and take the first step toward better mental well-being.",
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

          {/* Display the team members when on "Meet the Team" section */}
          {sections[currentSection].team && (
            <div
              className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg relative"
              style={{
                backgroundImage: "url('/images/team1.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundBlendMode: "overlay",
              }}
            >
              <div className="grid grid-cols-3 gap-4 bg-white bg-opacity-80 p-6 rounded-lg">
                {sections[currentSection].team.map((member, index) => (
                  <div key={index} className="text-center">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto shadow-lg"
                    />
                    <p className="font-bold mt-2">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
      <div className=""></div>
    </div>
  );
};

export default AboutContent;
