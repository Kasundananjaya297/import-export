/** @format */

import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db";
import userRoutes from "./routs/userRouts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Basic routes
app.get("/", (req, res) => {
  res.send("Server is running");
});


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/info", (req, res) => {
  res.send({
    PORT: PORT,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DB_URL,
  });
});

// User routes - Fix: Pass the router instead of a callback
app.use("/api/v1/user", userRoutes);

// Database connection and server start
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("MySQL connected!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });
