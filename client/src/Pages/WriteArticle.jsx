import React, { useState } from "react";
import { Edit, Sparkles } from "lucide-react";

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [input, setInput] = useState("");

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className=" h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        className="bg-white max-w-lg w-full rounded-lg border border-gray-200 shadow-lg p-4"
        onSubmit={onSubmitHandler}
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aff] " />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Article Topic</p>
        <input
          type="text"
          name=""
          id=""
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="the future of AI is..."
          className="rounded-md w-full outline-none border border-gray-300 p-2 px-3 mt-2 text-sm"
          required
        />

        <p className="mt-4 text-sm font-semibold">Article length</p>
        <div className="mt-3 flex flex-wrap gap-3 sm:max-w-9/11">
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs rounded-full cursor-pointer border px-4 py-1 ${
                selectedLength.text === item.text
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 border-gray-300"
              } `}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>
        <button className="flex justify-center items-center bg-gradient-to-r from-[#226bff] to-[#65adff] w-full rounded-lg mt-8 py-2 px-4 gap-2 text-white text-sm cursor-pointer">
          <Edit className="w-5" />
          Generate Article
        </button>
      </form>
      <div className="w-full max-w-lg bg-white p-4 max-h-[600px] min-h-96 flex flex-col border border-gray-200 shadow-lg rounded-lg">
        <div className="flex gap-3 items-center">
          <Edit className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Generated Article</h1>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm flex flex-col items-center text-gray-400 gap-5">
            <Edit className="w-9 h-9" />
            <p className="text-center">
              enter a topic and click "Generate Article" to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
