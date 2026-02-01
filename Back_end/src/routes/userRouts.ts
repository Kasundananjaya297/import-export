/** @format */

import express from "express";
import * as userController from "../controllers/userController";
import { verifyToken, isAdmin } from "../middleware/auth";
const router = express.Router();

router.post("/create", userController.createUser);
router.post("/login", userController.loginUser);
router.put("/update", verifyToken, userController.updateProfile);
router.get("/all", verifyToken, isAdmin, userController.getAllUsers);
router.get("/pending", verifyToken, isAdmin, userController.getPendingUsers);
router.patch("/:id/approve", verifyToken, isAdmin, userController.approveUser);
router.patch("/:id/reject", verifyToken, isAdmin, userController.rejectUser);

export default router;
