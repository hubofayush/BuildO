import { app } from "./app.js";
import dotenv from "dotenv";
// import { SQL } from "./db/index.js";

dotenv.config({
  path: [".env.local", ".env"],
});

const PORT = process.env.PORT || 4000;

try {
  app.listen(PORT, () => {
    console.log(`Server Started on port:${PORT}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
