import { File, Files, FileText } from "lucide-react";
import React from "react";
// #00da83
// #009bb3

const ReviewResume = () => {
  return (
    <div className="p-6 flex flex-wrap gap-4 text-slate-700 items-start h-full overflow-y-auto">
      {/* left column */}
      <form className="bg-white max-w-lg w-full p-4 shadow-lg border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="w-6 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Review Resume</h1>
        </div>
        <p className="mt-6 text-sm font-semibold">Upload resume file</p>
        <input
          type="file"
          className="mt-2 border border-gray-200 p-2 px-3 text-sm rounded-lg cursor-pointer w-full"
          accept="application/pdf"
        />
        <p className="text-xs font-light mt-1 text-gray-500">
          Supports PDF file only
        </p>

        <button className="bg-gradient-to-r from-[#00da83] to-[#009bb3] w-full flex items-center justify-center rounded-lg mt-8 py-2 px-4 gap-2 text-white text-sm cursor-pointer">
          <FileText className="w-5 " /> Review Resume
        </button>
      </form>
      {/* right column */}
      <div className="bg-white flex flex-col   overflow-y-auto min-h-96 w-full max-w-lg p-4 max-h-[600px] ">
        <div className="flex items-center gap-2">
          <FileText className="w-6 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-gray-400 text-sm">
            <File className="w-9 h-9" />
            <p className="text-center">
              Upload resume file and click "Review Resume" to analyze resume
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewResume;
