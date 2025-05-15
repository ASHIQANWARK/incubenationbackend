import express from "express";
import cors from "cors";
import helmet from "helmet";   // <-- import helmet
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

// Helmet for security headers including CSP
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],           // Allow content only from same origin by default
      fontSrc: [
        "'self'",
        "https://incubenationbackend.onrender.com",  // Allow fonts from your backend
      ],
      scriptSrc: ["'self'"],            // Adjust other directives as needed
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],      // Allow images from same origin & inline base64
      connectSrc: ["'self'"],           // For APIs etc
      // add others if you need like mediaSrc, objectSrc, etc.
    },
  })
);

// Body Parsers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Connect to MongoDB
connectDB();

// Define API Routes
app.use("/api", routes);

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
