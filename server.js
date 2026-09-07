import dotenv from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.MONGO_URI) await connectDB();
  app.listen(port, () => {
    console.log(`Eloop API listening on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start Eloop API:", error.message);
  process.exit(1);
});
