/** @format */
import express, { RequestHandler } from "express";
import * as reviewController from "../controllers/reviewController";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/", verifyToken as RequestHandler, reviewController.createReview as RequestHandler);
router.patch("/:id", verifyToken as RequestHandler, reviewController.updateReview as RequestHandler);
router.delete("/:id", verifyToken as RequestHandler, reviewController.deleteReview as RequestHandler);
router.get("/stall/:stallId", reviewController.getReviewsByStallId as RequestHandler);

export default router;
