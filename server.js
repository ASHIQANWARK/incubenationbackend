import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import routes from "./routes/route.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration (Allow frontend connections)
const corsOptions = {
  origin: ["http://localhost:5173", "https://incubenation.com"], // Update allowed origins
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" })); // Handle JSON data
app.use(express.urlencoded({ limit: "20mb", extended: true })); // Handle form data

// Connect to MongoDB
connectDB();

// Routes
app.use("/api", routes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

// Start the Server with Dynamic Port Handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Handle Port Conflicts
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`⚠️ Port ${PORT} is in use. Trying a different port...`);
    app.listen(PORT + 1, () => {
      console.log(`✅ Server running on http://localhost:${PORT + 1}`);
    });
  } else {
    console.error("❌ Server error:", err);
  }
});
