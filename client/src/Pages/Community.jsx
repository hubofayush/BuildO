import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
    const [creations, setCreations] = useState([]);

    const [loading, setLoading] = useState(true);

    const { user } = useUser();

    const { getToken } = useAuth();
    const fetchCreations = async () => {
        try {
            const { data } = await axios.get("/user/get-publish-creations", {
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

    const toggleLIkeCreation = async (id) => {
        try {
            const { data } = await axios.post(
                "/user/toggle-like-creation",
                { id },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                await fetchCreations();
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
    };
    useEffect(() => {
        if (user) {
            fetchCreations();
        }
    }, [user]);

    return !loading ? (
        <div className="flex-1 flex h-full flex-col gap-4 p-6">
            Creations
            <div className="w-full bg-white h-full rounded-xl overflow-y-auto">
                {creations.map((creation, index) => (
                    <div
                        className="relative inline-block group pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3 "
                        key={index}
                    >
                        <img
                            src={creation.content}
                            alt=""
                            className="w-full rounded-lg  object-cover h-full"
                        />
                        <div className="absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg">
                            <p className="text-sm hidden group-hover:block">
                                {creation.prompt}
                            </p>
                            <div className="flex gap-1 items-center">
                                <p>{creation.likes.length}</p>
                                <Heart
                                    onClick={() =>
                                        toggleLIkeCreation(creation.id)
                                    }
                                    className={`min-w-5 h-5 hover:scale-110 cursor-pointer
                    ${
                        creation.likes.includes(user.id)
                            ? "fill-red-500 text-red-600"
                            : "text-white"
                    }
                    `}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className="flex items-center justify-center h-full">
            <span className="w-10 h-10 my-1 border-primary rounded-full border-t-transparent animate-spin border-3"></span>
        </div>
    );
};

export default Community;
