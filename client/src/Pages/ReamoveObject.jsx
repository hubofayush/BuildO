import { useAuth } from "@clerk/clerk-react";
import { Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReamoveObject = () => {
    const [input, setInput] = useState("");
    const [object, setObject] = useState("");

    const [loading, setLoading] = useState(false);

    const [contnet, setContnet] = useState("");

    const { getToken } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (object.split(" ").length > 1) {
                setLoading(false);
                return toast("Enter only one object");
            }

            const formData = new FormData();
            formData.append("image", input);
            formData.append("object", object);

            const { data } = await axios.post("/ai/remove-object", formData, {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });

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
                <p className="mt-7 text-sm font-semibold">
                    Describe object to remove
                </p>
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
                <button
                    disabled={loading}
                    className="bg-gradient-to-r from-[#417df6] to-[#8e37eb]  flex items-center justify-center w-full rounded-lg mt-8 py-2 px-4 gap-2  cursor-pointer text-white text-sm "
                >
                    {loading ? (
                        <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
                    ) : (
                        <Scissors className="w-5" />
                    )}
                    Remove Object
                </button>
            </form>
            {/* right column */}
            <div className="bg-white p-4 shadow-lg w-full max-w-lg min-h-96 rounded-lg flex flex-col border border-gray-200 overflow-y-auto">
                <div className="flex items-center gap-2">
                    <Scissors className="w-6 text-[#4a7aff]" />
                    <h1 className="text-xl font-semibold">Processed Image</h1>
                </div>

                {!contnet ? (
                    <div className="flex flex-1 items-center justify-center">
                        <div className="text-sm flex flex-col items-center text-gray-400 gap-5">
                            <Scissors className="w-9 h-9" />
                            <p className="text-center">
                                Upload an image and describe what to remove
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

export default ReamoveObject;
