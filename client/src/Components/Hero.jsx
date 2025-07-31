import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center">
        <h1 className="font-semibold text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl mx-auto leading-[1.2]">
          <span className="bg-gradient-to-b from-red-900 via-blue-500 to-black text-transparent bg-clip-text">
            AI
          </span>{" "}
          is
          <span className=" text-primary"> AMAZING!</span>
          <br />
          create amazing content
        </h1>
        <p className="mt-4 max-w-xs sm:max-w-lg 2xl:max-w-xl mx-auto max-sm:text-xs text-gray-600">
          Use AI with our suite of premium AI tools. Write articles, Generate
          Images and enhance your workflow
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs mt-4">
        <button
          className="bg-primary rounded-lg cursor-pointer px-10 py-3 text-white hover:scale-102 active:scale-95 transition shadow-lg "
          onClick={() => {
            navigate("/ai");
          }}
        >
          Start generating now
        </button>
        <button className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer shadow-lg">
          <a
            href="https://youtu.be/RkYIWg5XAnI?si=wI9KgAJk0A6fPp8X"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch demo
          </a>
        </button>
      </div>
      <div className="flex justify-center gap-4 mx-auto mt-8 text-gray-600">
        <img src={assets.user_group} alt="group image" className="h-8" />
        Trusted By 100+ peoples
      </div>
    </div>
  );
};

export default Hero;
