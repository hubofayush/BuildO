import React, { useEffect, useState } from "react";
import { Gem, Sparkles } from "lucide-react";
import { Protect, useAuth } from "@clerk/clerk-react";
import CreationItem from "../Components/CreationItem";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
    const [creations, setCreations] = useState([]);

    const [loading, setLoading] = useState(true);

    const { getToken } = useAuth();
    const getCreations = async () => {
        try {
            const { data } = await axios.get("/user/get-user-creations", {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                },
            });

            if (data.success) {
                setCreations(data.data);
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

    useEffect(() => {
        getCreations();
    }, []);

    return (
        <div className=" overflow-y-auto p-6 h-full">
            <div className="flex flex-start gap-4 flex-wrap">
                {/* total creations card */}
                <div className="flex justify-between rounded-lg item-center w-72 p-4 px-6 bg-white border-gray-200 shadow-lg">
                    <div className="text-slate-600">
                        <p className="text-sm">Total Creation</p>
                        <h1 className="text-xl font-semibold">
                            {creations.length}
                        </h1>
                    </div>
                    <div className="flex  justify-center items-center bg-gradient-to-br from-[#3588F2] to-[#0B0BB7] rounded-lg w-10 h-10 text-white">
                        <Sparkles className="w-5 text-white" />
                    </div>
                </div>
                {/* plan card */}
                <div className="flex flex-wrap items-center justify-between p-4 px-6 w-72 bg-white border border-gray-200 shadow-lg rounded-lg ">
                    <div className="text-gray-600">
                        <p className="text-sm">Active Plan</p>
                        <h2 className="text-xl font-semibold">
                            <Protect plan="premium" fallback="Free">
                                Premium
                            </Protect>
                        </h2>
                    </div>
                    <div className="flex rounded-lg w-10 h-10 bg-gradient-to-br from-[#ff6175] to-[#9e53ee]  text-white justify-center items-center">
                        <Gem className="text-white w-5" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-3/4">
                    <div className="h-11 w-11 rounded-full border-purple-500 border-3 border-t-transparent animate-spin"></div>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="mt-6 mb-4">Recent Creations</p>
                    {creations.map((item) => (
                        <CreationItem key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
