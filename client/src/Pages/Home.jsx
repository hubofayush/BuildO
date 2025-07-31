import React from "react";
import Navbar from "../Components/Navbar";
import Hero from "../Components/Hero";
import AITools from "../Components/AITools";
import Testimonial from "../Components/Testimonials";
import Plans from "../Components/Plans";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AITools />
      <Testimonial />
      <Plans />
    </>
  );
};

export default Home;
