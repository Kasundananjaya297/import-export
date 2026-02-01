/** @format */

import express from "express";
import * as userController from "../controllers/userController";
import { verifyToken } from "../middleware/auth";
const router = express.Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/update", verifyToken, userController.updateProfile);

export default router;
