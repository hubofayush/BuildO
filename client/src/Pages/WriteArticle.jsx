import React, { useState } from "react";
import { Edit, FastForward, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
    const articleLength = [
        { length: 800, text: "Short (500-800 words)" },
        { length: 1200, text: "Medium (800-1200 words)" },
        { length: 1600, text: "Long (1200+ words)" },
    ];

    const [input, setInput] = useState("");

    const [selectedLength, setSelectedLength] = useState(articleLength[0]);

    const [loading, setLoading] = useState(false);

    const [content, setContent] = useState("");

    // getting token
    const { getToken } = useAuth();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        const prompt = `Generate an article about ${input} in ${selectedLength.text}.`;

        try {
            setLoading(true);
            const { data } = await axios.post(
                "/ai/generateArticle",
                { prompt, length: selectedLength.length },
                {
                    headers: {
                        Authorization: `Bearer ${await getToken()}`,
                    },
                }
            );

            if (data.success) {
                setContent(data.data);
                console.log(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    return (
        <div className=" h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
            <form
                className="bg-white max-w-lg w-full rounded-lg border border-gray-200 shadow-lg p-4"
                onSubmit={onSubmitHandler}
            >
                <div className="flex items-center gap-3">
                    <Sparkles className="w-6 text-[#4a7aff] " />
                    <h1 className="text-xl font-semibold">
                        Article Configuration
                    </h1>
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

                <button
                    disabled={loading}
                    className="flex justify-center items-center bg-gradient-to-r from-[#226bff] to-[#65adff] w-full rounded-lg mt-8 py-2 px-4 gap-2 text-white text-sm cursor-pointer"
                >
                    {loading ? (
                        <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
                    ) : (
                        <Edit className="w-5" />
                    )}
                    Generate Article
                </button>
            </form>
            <div className="w-full max-w-lg bg-white p-4 max-h-[600px] min-h-96 flex flex-col border border-gray-200 shadow-lg rounded-lg">
                <div className="flex gap-3 items-center">
                    <Edit className="w-5 h-5 text-[#4a7aff]" />
                    <h1 className="text-xl font-semibold">Generated Article</h1>
                </div>

                {!content ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-sm flex flex-col items-center text-gray-400 gap-5">
                            <Edit className="w-9 h-9" />
                            <p className="text-center">
                                enter a topic and click "Generate Article" to
                                get started
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

export default WriteArticle;
