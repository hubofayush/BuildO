import { Eraser, Image, Sparkles } from "lucide-react";
import React, { useState } from "react";

const RemoveBackgorund = () => {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-full p-6 flex flex-wrap gap-4 overflow-y-auto items-start text-slate-700">
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg w-full border border-gray-200 rounded-lg shadow-lg p-4"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#d76107]" />
          <h1 className="text-xl font-semibold">Remove Background</h1>
        </div>

        <p className="text-sm mt-6 font-semibold">Upload Image</p>
        <input
          type="file"
          accept="image/*"
          className="outline-none border border-gray-200 p-2 px-3 mt-2 rounded-md text-sm w-full cursor-pointer text-gray-600 "
          required
          onChange={(e) => setInput(e.target.files[0])}
        />
        <p className="text-xs font-light mt-1 text-gray-500">
          Supports JPG,PNG and other Image formats.
        </p>
        <button className="w-full bg-gradient-to-r from-[#F76C1C] to-[#F04A3C] flex items-center justify-center p-2 px-4 text-white gap-2 text-sm rounded-lg mt-8 cursor-pointer">
          <Eraser className="w-5" />
          Remove Background
        </button>
      </form>
      {/* right columb */}
      <div className="bg-white w-full max-w-lg shadow-lg rounded-lg flex flex-col border border-gray-200 p-4 min-h-96">
        <div className="flex gap-3 items-center">
          <Eraser className="w-5 h-5 text-[#d76107]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex flex-1 items-center">
          <div className="flex flex-col items-center justify-center text-gray-400 text-sm gap-3">
            <Image className="w-9 h-9" />
            <p className="text-center">
              Upload file and click "Remove Backgorund" to remove background of
              image
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackgorund;
