import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Layout from "./Pages/Layout";
import Dashboard from "./Pages/Dashboard";
import WriteArticle from "./Pages/WriteArticle";
import BlogTitles from "./Pages/BlogTitles";
import Community from "./Pages/Community";
import GenerateImages from "./Pages/GenerateImages";
import ReamoveObject from "./Pages/ReamoveObject";
import RemoveBackgorund from "./Pages/RemoveBackgorund";
import ReviewResume from "./Pages/ReviewResume";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

const App = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        getToken().then((token) => console.log(token));
    }, []);

    return (
        <>
            <Toaster />
            <Routes>
                <Route path="/" element={<Home />} />
                // nested routes //
                <Route path="/ai" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="blog-titles" element={<BlogTitles />} />
                    <Route path="community" element={<Community />} />
                    <Route
                        path="generate-images"
                        element={<GenerateImages />}
                    />
                    <Route path="remove-object" element={<ReamoveObject />} />
                    <Route
                        path="remove-background"
                        element={<RemoveBackgorund />}
                    />
                    <Route path="review-resume" element={<ReviewResume />} />
                    <Route path="write-article" element={<WriteArticle />} />
                </Route>
                // end of nested routes //
            </Routes>
        </>
    );
};

export default App;
