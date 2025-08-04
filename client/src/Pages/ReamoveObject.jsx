import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";

const ReamoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-full flex items-start gap-4 p-6 flex-wrap overflow-y-auto text-slate-700">
      {/* left column */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg border border-gray-200 shadow-lg p-4 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Upload Image</p>
        <input
          type="file"
          required
          accept="image/*"
          className="border mt-2 p-2 px-3 rounded-md border-gray-200 w-full text-sm text-gray-600 cursor-pointer"
          onChange={(e) => setInput(e.target.files[0])}
        />
        <p className="mt-7 text-sm font-semibold">Describe object to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          required
          rows={4}
          className="cursor-pointer rounded-md w-full outline-none border border-gray-300 p-2 px-3 mt-2 text-sm"
          placeholder="eg., Tree in background, Car from image"
        />
        <p className="text-xs font-light mt-1 text-gray-500">
          Be spacific about what you want to remove
        </p>
        <button className="bg-gradient-to-r from-[#417df6] to-[#8e37eb]  flex items-center justify-center w-full rounded-lg mt-8 py-2 px-4 gap-2  cursor-pointer text-white text-sm ">
          <Scissors className="w-5" /> Remove Object
        </button>
      </form>
      {/* right column */}
      <div className="bg-white p-4 shadow-lg w-full max-w-lg min-h-96 rounded-lg flex flex-col border border-gray-200 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Scissors className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm flex flex-col items-center text-gray-400 gap-5">
            <Scissors className="w-9 h-9" />
            <p className="text-center">
              Upload an image and describe what to remove
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReamoveObject;
