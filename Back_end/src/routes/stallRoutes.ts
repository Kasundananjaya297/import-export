/** @format */
import express from "express";
import * as stallController from "../controllers/stallController";
import { verifyToken, isAdmin } from "../middleware/auth";

const router = express.Router();

router.get("/public/:id", stallController.getStallById);

router.use(verifyToken);

router.post("/create", stallController.createStall);
router.get("/me", stallController.getStall);
router.put("/update", stallController.updateStall);
router.get("/all", isAdmin, stallController.getAllStalls);

export default router;
