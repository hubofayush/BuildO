import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();

  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="fixed z-5 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 cursor-pointer">
      <img
        src={assets.newlogo}
        alt="logo"
        className="w-32 sm:w-44"
        onClick={useNavigate(() => navigate("/"))}
      />

      {user ? (
        <UserButton />
      ) : (
        <button
          className="flex items-center gap-2 rounded-full text-sm bg-primary px-10 py-2.5 cursor-pointer text-white shadow-lg"
          onClick={openSignIn}
        >
          Get Started
          <ArrowRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
