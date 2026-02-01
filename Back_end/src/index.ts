import dotenv from "dotenv";
import path from "path";

// Load env vars before anything else
const envPath = path.resolve(__dirname, "../.env");
console.log("Loading .env from:", envPath);
console.log("PORT before dotenv:", process.env.PORT);
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log("Error loading .env file:", result.error);
  // Fallback
  dotenv.config();
}

// Log env state immediately
console.log("PORT immediately after load:", process.env.PORT);

import express from "express";
import sequelize from "./config/db";
import userRoutes from "./routes/userRouts";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import stallRoutes from "./routes/stallRoutes";
import cors from "cors";
// Import models with associations
import "./models/index";



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Authorization"],
    maxAge: 86400, // 24 hours
  }),
);

// Set security headers
app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Basic routes
app.get("/", (req, res) => {
  res.send("Server is running");
});

//test

app.get("/info", (req, res) => {
  res.send({
    PORT: PORT,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DB_URL,
  });
});

// User routes
app.use("/api/user", userRoutes);

// Product routes
app.use("/api/products", productRoutes);

// Order Routes
app.use("/api/order", orderRoutes);

// Payment Routes
app.use("/api/payment", paymentRoutes);

// Complaint Routes
app.use("/api/complaint", complaintRoutes);

// Stall Routes
app.use("/api/stall", stallRoutes);

// Serve static files for uploaded images
app.use("/shared/uploads", express.static("shared/uploads"));

// Database connection and server start
// Database connection and server start
sequelize
  .sync({ alter: true }) // Changed to alter: true to update db schema with new Fish Listing columns
  .then(() => {
    console.log("MySQL connected!");
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Database Host: ${process.env.DB_HOST}`);
    });

    server.on('error', (error) => {
      console.error("Server failed to start:", error);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
