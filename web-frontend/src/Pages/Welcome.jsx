import React from "react";
import MobileView from "../assets/images/mobile.png";
import { useSelector } from "react-redux";

const Welcome = () => {
  const user = useSelector((state) => state.auth);

  console.log(user);

  return (
    <div className="absolute top-10 left-0 h-full">
      <section className="w-full px-14 grid grid-cols-2 h-full">
        <div className="flex justify-start items-center">
          <p></p>
          <div>
            <h4 className="font-extrabold text-4xl mb-5">
              Find the Right Counseling for You with AI-Powered Insights!
            </h4>
            <p className="text-lg text-gray-600">
              Take a quick quiz to determine the best counseling type for your
              needs. Play wellness games, chat with our AI counselor, and start
              your journey to mental well-being.
            </p>
            <div className="mt-4 flex justify-start items-center gap-4">
              <button className="p-4 px-8 rounded-lg shadow-xl bg-[#0cdfc6] text-white font-bold">
                Try Now
              </button>
              <button className="p-4 px-8 rounded-lg shadow-xl font-bold">
                Learn More
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="pseudo-phone">
            <div className="pseudo-phone__top"></div>
            <div>
              <img src={MobileView} />
            </div>
          </div>
        </div>
      </section>
      <section className="mt-5 w-full px-14">
        <div className="w-full">
          <div className="w-full text-center font-bold text-4xl">
            How it works
          </div>
          <div className="w-full text-center mt-2 text-lg text-gray-600">
            Discover how our AI-powered system guides you to the right
            counseling path.
          </div>
          <div className="h-100 mt-4 grid grid-cols-3 gap-4">
            <div className="how-to__card rounded-4xl"></div>
            <div className="how-to__card rounded-4xl"></div>
            <div className="how-to__card rounded-4xl"></div>
          </div>
        </div>
      </section>
      <section className="mt-14 px-14">
        <div className="w-full text-star font-bold text-4xl">Features</div>
        <div className="w-full text-star mt-2 text-lg text-gray-600">
          Discover how our AI-powered system guides you to the right counseling
          path.
        </div>
        <div className="min-h-96"></div>
      </section>
    </div>
  );
};

export default Welcome;
