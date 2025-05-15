import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/route.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Options — Allow specific frontend origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://www.incubenation.com",
    "https://incubenation.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Body Parsers
app.use(express.json({ limit: "20mb" })); // Parse JSON payloads
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Parse URL-encoded data

// Connect to MongoDB
connectDB();

// Mount all admin-related routes under /api/admin
app.use("/api/admin", routes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
