import React from "react"; 
import { PricingTable } from "@clerk/clerk-react";
const Plans = () => {
  return (
    <div className="max-w-2xl mx-auto my-20 z-30">
      <div className="text-center">
        <h1 className="text-slate-700 font-semibold text-[42px]">Our Plans</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Start for free and scale up as you grow. Find the perfect plan for
          your content creation needs.
        </p>
      </div>
      <div className="mt-14 max-sm:mx-8">
        <PricingTable />
      </div>
    </div>
  );
};

export default Plans;
