import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { DollarSign, Gem, Sparkles, SparklesIcon } from "lucide-react";
import { Protect } from "@clerk/clerk-react";
import CreationItem from "../Components/CreationItem";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);

  const getCreations = () => {
    setCreations(dummyCreationData);
  };

  useEffect(() => {
    getCreations();
  }, []);

  return (
    <div className=" overflow-y-auto p-6 h-full">
      <div className="flex flex-start gap-4 flex-wrap">
        {/* total creations card */}
        <div className="flex justify-between rounded-lg item-center w-72 p-4 px-6 bg-white border-gray-200 shadow-lg">
          <div className="text-slate-600">
            <p className="text-sm">Total Creation</p>
            <h1 className="text-xl font-semibold">{creations.length}</h1>
          </div>
          <div className="flex  justify-center items-center bg-gradient-to-br from-[#3588F2] to-[#0B0BB7] rounded-lg w-10 h-10 text-white">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>
        {/* plan card */}
        <div className="flex flex-wrap items-center justify-between p-4 px-6 w-72 bg-white border border-gray-200 shadow-lg rounded-lg ">
          <div className="text-gray-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>
            </h2>
          </div>
          <div className="flex rounded-lg w-10 h-10 bg-gradient-to-br from-[#ff6175] to-[#9e53ee]  text-white justify-center items-center">
            <Gem className="text-white w-5" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>
        {creations.map((item) => (
          <CreationItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
