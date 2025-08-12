import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
// import { SQL } from "./db/index.js";

dotenv.config({
    path: [".env.local", ".env"],
    quiet: true,
});

const PORT = process.env.PORT || 4000;

connectDB()
    .then(
        app.listen(PORT, () => {
            console.log("\nServer Started on PORT:", PORT);
        })
    )
    .catch((err) => {
        console.log("Server Not Started:", err);
    });
