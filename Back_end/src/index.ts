/** @format */

import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRoutes from "./routes/userRouts";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import complaintRoutes from "./routes/complaintRoutes";
import cors from "cors";
// Import models with associations
import "./models/index";

dotenv.config();

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

// Serve static files for uploaded images
app.use("/shared/uploads", express.static("shared/uploads"));

// Database connection and server start
sequelize
  .sync({ force: false }) // Changed back to false after creating tables with foreign keys
  .then(() => {
    console.log("MySQL connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });
