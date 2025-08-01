import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { Menu, X } from "lucide-react";
import Sidebar from "../Components/Sidebar";
import { useUser, SignIn } from "@clerk/clerk-react";

const Layout = () => {
  const [sidebar, setSetsidebar] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  return user ? (
    <div className="flex flex-col justify-start items-start h-screen">
      <nav className="w-full min-h-14 px-8 flex items-center justify-between border-b border-gray-200">
        <img
          src={assets.logo}
          alt="logo"
          onClick={() => navigate("/")}
          className="cursor-pointer w-32 sm:w-44"
        />
        {sidebar ? (
          <X
            onClick={() => setSetsidebar((prev) => !prev)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        ) : (
          <Menu
            onClick={() => setSetsidebar((prev) => !prev)}
            className="w-6 h-6 text-gray-600 sm:hidden"
          />
        )}
      </nav>
      <div className="flex flex-1 h-[calc(100vh-64px)] w-full">
        <Sidebar sidebar={sidebar} setSidebar={setSetsidebar} />
        <div className="flex-1 bg-[#F4F7Fb]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <SignIn />
    </div>
  );
};

export default Layout;
