/** @format */

import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());

export default app;
