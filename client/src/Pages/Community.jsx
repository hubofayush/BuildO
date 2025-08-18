import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import axios from "axios";
import debounce from "lodash/debounce"; // Install: npm i lodash

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
    const [creations, setCreations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState({}); // Per-creation loading
    const [userLikes, setUserLikes] = useState({}); // Cache: { creationId: true/false }
    const { user } = useUser();
    const { getToken } = useAuth();

    const fetchCreations = async () => {
        try {
            // const token = await getToken();
            // console.log("Fetching creations with token:", token); // Debug
            const { data } = await axios.get("user/get-publish-creations", {
                headers: { Authorization: `Bearer ${await getToken()}` },
            });

            if (data.success) {
                setCreations(data.data);
                await fetchUserLikes(data.data.map((c) => c._id));
            } else {
                toast.error(data.message || "Failed to fetch creations");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "An error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLikes = async (creationIds) => {
        if (!user || !creationIds.length) return;

        try {
            // const token = await getToken();
            // console.log("Fetching likes with token:", token); // Debug
            const promises = creationIds.map(async (id) => {
                const { data } = await axios.get(`user/get-likers/${id}`, {
                    headers: { Authorization: `Bearer ${await getToken()}` },
                });
                if (data.success) {
                    const userLiked = data.data.some(
                        (like) => like.user_id === user.id
                    );
                    return { id, liked: userLiked };
                }
                return { id, liked: false };
            });

            const results = await Promise.all(promises);
            setUserLikes((prev) => ({
                ...prev,
                ...results.reduce(
                    (acc, { id, liked }) => ({ ...acc, [id]: liked }),
                    {}
                ),
            }));
        } catch (error) {
            console.error(
                "Error fetching user likes:",
                error.response || error
            );
        }
    };

    const toggleLikeCreation = debounce(async (creationId) => {
        if (likeLoading[creationId]) return;

        setLikeLoading((prev) => ({ ...prev, [creationId]: true }));
        const prevCreations = [...creations];
        setCreations((prev) =>
            prev.map((c) =>
                c._id === creationId
                    ? {
                          ...c,
                          like_count: userLikes[creationId]
                              ? c.like_count - 1
                              : c.like_count + 1,
                      }
                    : c
            )
        );
        setUserLikes((prev) => ({
            ...prev,
            [creationId]: !prev[creationId],
        }));

        try {
            // const token = await getToken();
            // console.log("Toggling like with token:", token); // Debug
            const { data } = await axios.post(
                "user/toggle-like-creation",
                { id: creationId },
                { headers: { Authorization: `Bearer ${await getToken()}` } }
            );

            if (data.success) {
                toast.success(data.message);
                setCreations((prev) =>
                    prev.map((c) =>
                        c._id === creationId
                            ? { ...c, like_count: data.data.like_count }
                            : c
                    )
                );
            } else {
                throw new Error(data.message || "Failed to toggle like");
            }
        } catch (error) {
            setCreations(prevCreations);
            setUserLikes((prev) => ({
                ...prev,
                [creationId]: !prev[creationId],
            }));
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to toggle like"
            );
        } finally {
            setLikeLoading((prev) => ({ ...prev, [creationId]: false }));
        }
    }, 300);

    useEffect(() => {
        if (user) {
            fetchCreations();
        }
    }, [user]);

    const SkeletonCard = () => (
        <div className="relative inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3">
            <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
    );

    return (
        <div className="flex-1 flex h-full flex-col gap-4 p-6">
            <h2 className="text-2xl font-bold">Community Creations</h2>
            {loading ? (
                <div className="w-full bg-white h-full rounded-xl overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {Array(6)
                        .fill()
                        .map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                </div>
            ) : (
                <div className="flex-1 flex h-full flex-col gap-4 p-6">
                    <div className="w-full bg-white h-full rounded-xl overflow-y-auto">
                        {creations.length === 0 ? (
                            <p className="text-center text-gray-500 col-span-full">
                                No creations found.
                            </p>
                        ) : (
                            creations.map((creation, index) => (
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
                                            <p>{creation.like_count}</p>
                                            <Heart
                                                onClick={() =>
                                                    toggleLikeCreation(
                                                        creation._id
                                                    )
                                                }
                                                className={`min-w-5 h-5 hover:scale-110 cursor-pointer
                                                    ${
                                                        userLikes[creation._id]
                                                            ? "fill-red-500 text-red-600"
                                                            : "text-white"
                                                    }
                                                    ${
                                                        likeLoading[
                                                            creation._id
                                                        ]
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }
                 `}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
