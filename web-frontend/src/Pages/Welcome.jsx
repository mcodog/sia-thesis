import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MobileView from "../assets/images/mobile.png";
import QuizIcon from "../assets/images/quiz.png";
import RecommendationIcon from "../assets/images/recommendation.png";
import CounselingIcon from "../assets/images/counseling.png";
import JourneyIcon from "../assets/images/Journey.png";
import ChatbotIcon from "../assets/images/ai.png";
import GamesIcon from "../assets/images/games.png";
import TipsIcon from "../assets/images/tips.png";

const Welcome = () => {
  const { scrollYProgress } = useScroll();

  // Parallax effect for hero image
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Opacity and scale for sections
  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="absolute top-10 left-0 w-full min-h-screen bg-gradient-to-r from-emerald-500 to-teal-600 text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="w-full px-14 grid grid-cols-2 h-screen items-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <h4 className="text-6xl font-extrabold mb-5 drop-shadow-lg leading-tight">
            Find the Right Counseling for You with AI-Powered Insights!
          </h4>
          <p className="text-lg text-gray-100 drop-shadow-md">
            Take a quick quiz to determine the best counseling type for your needs. Play wellness
            games, chat with our AI counselor, and start your journey to mental well-being.
          </p>
          <div className="mt-6 flex gap-4">
            <motion.button
              className="p-4 px-8 rounded-lg shadow-lg bg-green-500 hover:bg-green-600 text-white font-bold cursor-pointer transition duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Try Now
            </motion.button>
            <motion.button
              className="p-4 px-8 rounded-lg shadow-lg bg-white text-gray-900 font-bold cursor-pointer hover:bg-gray-200 transition duration-300 hover:shadow-xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        <div className="flex justify-center items-center">
          <motion.img
            src={MobileView}
            alt="Mobile View"
            className="w-80 h-auto drop-shadow-lg border-8 border-white rounded-3xl"
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </section>

      <div className="w-full h-1 bg-white my-10"></div>

      {/* HOW IT WORKS SECTION */}
<section
  className="mt-10 px-14 text-center relative py-20"
  style={{
    background: "url('/path-to-your-background-image.jpg') center/cover no-repeat",
  }}
>
  <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>
  <div className="relative z-10">
    <h2 className="text-5xl font-bold drop-shadow-lg text-white">How it works</h2>
    <p className="text-lg text-gray-200 mt-2 drop-shadow-md">
      Discover how our AI-powered system guides you to the right counseling path.
    </p>
    <motion.div
      className="mt-10 grid grid-cols-3 gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
    >
      {[
        {
          icon: QuizIcon,
          title: "Step 1: Take a Quiz",
          text: "Answer a few quick questions to assess your needs.",
        },
        {
          icon: RecommendationIcon,
          title: "Step 2: Get Recommendations",
          text: "Receive AI-driven counseling suggestions tailored for you.",
        },
        {
          icon: JourneyIcon,
          title: "Step 3: Start Your Journey",
          text: "Engage with our AI counselor and begin improving your mental well-being.",
        },
      ].map((step, index) => (
        <motion.div
          key={index}
          className="p-6 rounded-xl shadow-xl flex flex-col items-center text-center border border-white/50 backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.2) 100%)",
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 + index * 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <img src={step.icon} alt={step.title} className="w-24 h-24 mb-4 drop-shadow-lg" />
          <h3 className="text-xl font-bold text-gray-900 drop-shadow-lg">{step.title}</h3>
          <p className="text-gray-800 mt-2 drop-shadow-md">{step.text}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

      <div className="w-full h-1 bg-white my-10"></div>

      {/* FEATURES SECTION */}
      <section className="mt-10 px-14 text-center">
        <h2 className="text-5xl font-bold drop-shadow-lg">Features</h2>
        <p className="text-lg text-gray-200 mt-2 drop-shadow-md">
          Explore the cutting-edge features of our AI-driven counseling platform.
        </p>
        <motion.div
          className="mt-10 grid grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          {[
            {
              icon: ChatbotIcon,
              title: "AI Chatbooth",
              text: "Chat with an AI counselor for instant guidance and support.",
            },
            {
              icon: GamesIcon,
              title: "Activities",
              text: "Play engaging wellness games to relax and improve mental health.",
            },
            {
              icon: TipsIcon,
              title: "Tips & Knowledge",
              text: "Access expert-backed mental health tips and advice anytime.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-xl shadow-xl flex flex-col items-center text-center border border-white/50 backdrop-blur-xl"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.2) 100%)",
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <img src={feature.icon} alt={feature.title} className="w-24 h-24 mb-4 drop-shadow-lg" />
              <h3 className="text-xl font-bold text-gray-900 drop-shadow-lg">{feature.title}</h3>
              <p className="text-gray-800 mt-2 drop-shadow-md">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      
      {/* GET HELP SECTION */}
      <section className="mt-10 px-14 text-center">
        <h2 className="text-5xl font-bold drop-shadow-lg">Get Help</h2>
        <p className="text-lg text-gray-200 mt-2 drop-shadow-md">
          You're not alone. If you're struggling, reach out to professionals who can help.
        </p>

        <motion.div
          className="mt-10 grid grid-cols-2 gap-10 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <motion.div
            className="p-8 rounded-lg shadow-lg border border-white/50 backdrop-blur-xl text-left"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.2) 100%)",
            }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 drop-shadow-lg">
              Need Immediate Support?
            </h3>
            <p className="text-gray-800 mt-3 drop-shadow-md">
              If you're feeling overwhelmed, talking to someone can help. Professional counselors
              are available to support you 24/7.
            </p>
            <div className="mt-4 p-4 bg-white rounded-md shadow-md text-gray-900">
              <p className="font-bold text-lg">📞 Mental Health Helpline</p>
              <p className="text-md">Call (Philippines): <span className="font-semibold">1553 (Toll-Free)</span></p>
              <p className="text-md">National Center for Mental Health Crisis Line:</p>
              <p className="text-md">Luzon: <span className="font-semibold">0917-899-8727</span> or (02) 7989-8727</p>
              <p className="text-md">Visayas and Mindanao: <span className="font-semibold">0966-351-4518</span> or 0939-235-9670</p>
            </div>
            <motion.button
              className="mt-6 p-4 px-8 rounded-lg shadow-lg bg-green-500 hover:bg-green-600 text-white font-bold cursor-pointer transition duration-300 hover:shadow-2xl"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Talk to a Professional
            </motion.button>
          </motion.div>
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <img src={CounselingIcon} alt="Counseling Support" className="w-72 h-auto drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </section>
      <footer className="mt-14 px-14 py-6 bg-gray-900 text-center text-gray-300">
        <p>&copy; 2025 PathFinder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Welcome;
