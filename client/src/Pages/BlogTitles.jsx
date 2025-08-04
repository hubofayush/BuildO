import { Hash, Sparkles } from "lucide-react";
import React, { useState } from "react";

const BlogTitles = () => {
  const blogCategories = [
    "General",
    "Education",
    "Technology",
    "Buisness",
    "Health",
    "Lifestyle",
    "World Affairs",
    "Travel",
    "Food",
  ];

  const [setselectedCategory, setSetselectedCategory] = useState(
    blogCategories[0]
  );

  const [input, setInput] = useState("");

  const handleonSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        className="bg-white max-w-lg w-full rounded-lg border border-gray-200 shadow-lg p-4"
        onSubmit={handleonSubmit}
      >
        <div className="flex items-center gap-3 ">
          <Sparkles className="w-6 text-[#d937e4]" />
          <h1 className="text-xl font-semibold">AI Title Generator</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Keyword</p>
        <input
          type="text"
          name=""
          id=""
          className="rounded-md w-full outline-none border border-gray-300 p-2 px-3 mt-2 text-sm"
          placeholder="Enter keywords to generate title"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck
        />
        <p className="mt-8 text-sm  font-semibold ">Category</p>
        <div className="mt-3 flex flex-wrap gap-3 ">
          {blogCategories.map((category, index) => (
            <span
              key={index}
              className={`text-xs rounded-full cursor-pointer border px-4 py-1 ${
                setselectedCategory === category
                  ? "bg-purple-50 text-purple-700"
                  : "text-gray-500 border-gray-300"
              }`}
              onClick={() => setSetselectedCategory(category)}
            >
              {category}
            </span>
          ))}
        </div>
        <button className=" flex justify-center items-center mt-8 py-2 px-2 gap-2 bg-gradient-to-r from-[#B153EA] to-[#E549A3] w-full rounded-lg text-white text-sm cursor-pointer">
          <Hash className="w-5" />
          Generate Title
        </button>
      </form>

      {/* Right column */}
      <div className="bg-white w-full max-w-lg flex p-4  min-h-96 flex-col border border-gray-200 rounded-lg shadow-lg">
        <div className="w-full flex items-center gap-3">
          <Hash className="w-5 text-[#d937e4]" />
          <h1 className="font-semibold text-xl">Generate Title</h1>
        </div>
        <div className="flex  flex-1 items-center justify-center">
          <div className="flex flex-col items-center text-sm text-gray-400 gap-5">
            <Hash className="w-9 h-9" />
            <p>
              Enter topic and click "Generate Article" to Generate Article Title
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTitles;
