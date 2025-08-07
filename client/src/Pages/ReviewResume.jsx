import { File, Files, FileText } from "lucide-react";
import React from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useState } from "react";
// #00da83
// #009bb3
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
    const [input, setInput] = useState("");

    const [loading, setLoading] = useState(false);

    const [content, setContent] = useState("");

    // getting token
    const { getToken } = useAuth();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("resume", input);

            const { data } = await axios.post("/ai/resume-review", formData, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                },
            });

            if (data.success) {
                setContent(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "An error occurred";
            toast.error(errorMessage);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 flex flex-wrap gap-4 text-slate-700 items-start h-full overflow-y-auto">
            {/* left column */}
            <form
                onSubmit={onSubmitHandler}
                className="bg-white max-w-lg w-full p-4 shadow-lg border border-gray-200 rounded-lg"
            >
                <div className="flex items-center gap-3">
                    <FileText className="w-6 text-[#00da83]" />
                    <h1 className="text-xl font-semibold">Review Resume</h1>
                </div>
                <p className="mt-6 text-sm font-semibold">Upload resume file</p>
                <input
                    type="file"
                    className="mt-2 border border-gray-200 p-2 px-3 text-sm rounded-lg cursor-pointer w-full"
                    accept="application/pdf"
                    onChange={(e) => setInput(e.target.files[0])}
                    required
                />
                <p className="text-xs font-light mt-1 text-gray-500">
                    Supports PDF file only
                </p>

                <button
                    disabled={loading}
                    className="bg-gradient-to-r from-[#00da83] to-[#009bb3] w-full flex items-center justify-center rounded-lg mt-8 py-2 px-4 gap-2 text-white text-sm cursor-pointer"
                >
                    {loading ? (
                        <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
                    ) : (
                        <FileText className="w-5 " />
                    )}
                    Review Resume
                </button>
            </form>
            {/* right column */}
            <div className="bg-white flex flex-col   overflow-y-auto min-h-96 w-full max-w-lg p-4 max-h-[600px] ">
                <div className="flex items-center gap-2">
                    <FileText className="w-6 text-[#00da83]" />
                    <h1 className="text-xl font-semibold">Analysis Result</h1>
                </div>
                {!content ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex flex-col items-center gap-4 text-gray-400 text-sm">
                            <File className="w-9 h-9" />
                            <p className="text-center">
                                Upload resume file and click "Review Resume" to
                                analyze resume
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
                        <div className="reset-tw">
                            <Markdown>{content}</Markdown>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewResume;
