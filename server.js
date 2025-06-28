import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection.js";
import errorHandler from "./middleware/errorHandler.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js"

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
