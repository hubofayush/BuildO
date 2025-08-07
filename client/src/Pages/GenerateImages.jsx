import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const GenerateImages = () => {
    const styles = [
        "Realistic",
        "Ghibli Style",
        "Cartoon Style",
        "Anime Style",
        "Fantasy Style",
        "Portrait Style",
        "3D Style",
    ];
    const [selectedStyle, setSelectedStyle] = useState(styles[0]);

    const [input, setInput] = useState("");

    const [publish, setPublish] = useState(false);

    const [loading, setLoading] = useState(false);

    const [contnet, setContnet] = useState("");

    const { getToken } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const prompt = `Generate an image of ${input} in style ${selectedStyle}`;

            const { data } = await axios.post(
                "/ai/generate-image",
                { prompt, publish },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                setContnet(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            // toast.error(error.message);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "An error occurred";
            toast.error(errorMessage);
        }
        setLoading(false);
    };
    return (
        <div className="p-6 h-full flex gap-4 overflow-y-auto items-start flex-wrap text-slate-700">
            <form
                className="bg-white max-w-lg w-full rounded-lg border border-gray-200 shadow-lg p-4"
                onSubmit={handleSubmit}
            >
                <div className="flex items-center  gap-3">
                    <Sparkles className="w-6 text-[#2ccd04]" />
                    <h1 className="text-xl font-semibold">Generate Image</h1>
                </div>
                <p className="mt-6 font-semibold text-sm">
                    Describe your Image
                </p>
                <textarea
                    required
                    rows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="describe what you want to see in image"
                    className=" rounded-md w-full outline-none border border-gray-300 p-2 px-3 mt-2 text-sm"
                />
                <p className="font-semibold text-sm mt-6">Style</p>
                <div className="mt-3 flex flex-wrap gap-3 ">
                    {styles.map((style, index) => (
                        <span
                            key={index}
                            className={`text-xs rounded-full cursor-pointer border px-4 py-1 ${
                                selectedStyle === style
                                    ? "text-green-700 bg-green-50"
                                    : "text-gray-500 border-gray-300"
                            }`}
                            onClick={() => setSelectedStyle(style)}
                        >
                            {style}
                        </span>
                    ))}
                </div>

                <div className="my-6 flex items-center gap-2">
                    <label className="relative cursor-pointer">
                        <input
                            type="checkbox"
                            checked={publish}
                            onChange={(e) => setPublish(e.target.checked)}
                            className="sr-only peer"
                            id="publish"
                        />

                        <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition"></div>

                        <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4"></span>
                    </label>
                    <label className="text-sm" htmlFor="publish">
                        Make this image public
                    </label>
                </div>

                <button
                    disabled={loading}
                    className="flex  items-center justify-center  w-full bg-gradient-to-r from-[#20C363] to-[#11B97E]  p-2 text-white text-sm rounded-lg mt-8 py-2 px-4 gap-2 cursor-pointer"
                >
                    {loading ? (
                        <div className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></div>
                    ) : (
                        <Image className="w-5" />
                    )}
                    Generate Image
                </button>
            </form>

            {/* right column */}
            <div className="w-full max-w-lg bg-white p-4  min-h-96  flex flex-col border border-gray-200 shadow-lg rounded-lg">
                <div className="flex items-center gap-3">
                    <Image className="w-6 h-6 text-[#2ccd04]" />
                    <h1 className="text-xl font-semibold">Generate Imgae</h1>
                </div>

                {!contnet ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex gap-3 items-center flex-col justify-center text-sm text-gray-400">
                            <Image className="w-9 h-9 " />
                            <p className="text-center">
                                Describe your image and click "Generate Image"
                                to generate Image
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 h-full">
                        <img
                            src={contnet}
                            alt="image"
                            className="w-full h-full"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerateImages;
