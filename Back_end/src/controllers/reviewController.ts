/** @format */
import { Request, Response } from "express";
import * as reviewService from "../services/reviewServices";
import { responseDTO } from "../responseDTO/responseDTO";

export const createReview = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json(responseDTO("error", null, "Unauthorized"));
        }

        const reviewData = {
            ...req.body,
            userId,
        };

        const review = await reviewService.createReview(reviewData);
        res.status(201).json(responseDTO("success", review, "Review submitted successfully"));
    } catch (error: any) {
        console.error("Error in reviewController.createReview:", error);

        // Handle Sequelize Unique Constraint Error
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json(responseDTO("error", null, "You have already reviewed this stall. You can edit your existing review instead."));
        }

        res.status(500).json(responseDTO("error", null, error.message || "Error submitting review"));
    }
};

export const updateReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json(responseDTO("error", null, "Unauthorized"));
        }

        const review = await reviewService.updateReview(Number(id), userId, req.body);
        res.status(200).json(responseDTO("success", review, "Review updated successfully"));
    } catch (error: any) {
        console.error("Error in reviewController.updateReview:", error);
        res.status(500).json(responseDTO("error", null, error.message || "Error updating review"));
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!userId) {
            return res.status(401).json(responseDTO("error", null, "Unauthorized"));
        }

        await reviewService.deleteReview(Number(id), userId, userRole);
        res.status(200).json(responseDTO("success", null, "Review deleted successfully"));
    } catch (error: any) {
        console.error("Error in reviewController.deleteReview:", error);
        res.status(500).json(responseDTO("error", null, error.message || "Error deleting review"));
    }
};

export const getReviewsByStallId = async (req: Request, res: Response) => {
    try {
        const { stallId } = req.params;
        const reviews = await reviewService.getReviewsByStallId(Number(stallId));
        const stats = await reviewService.getStallRatingStats(Number(stallId));

        res.status(200).json(responseDTO("success", { reviews, stats }, "Reviews fetched successfully"));
    } catch (error: any) {
        console.error("Error in reviewController.getReviewsByStallId:", error);
        res.status(500).json(responseDTO("error", null, error.message || "Error fetching reviews"));
    }
};
