/** @format */
import * as reviewRepo from "../repos/reviewRepo";

export const createReview = async (data: any) => {
    try {
        if (!data.rating || data.rating < 1 || data.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        if (!data.comment || data.comment.trim() === "") {
            throw new Error("Comment is required");
        }
        return await reviewRepo.createReview(data);
    } catch (error) {
        throw error;
    }
};

export const getReviewsByStallId = async (stallId: number) => {
    try {
        return await reviewRepo.getReviewsByStallId(stallId);
    } catch (error) {
        throw error;
    }
};

export const getStallRatingStats = async (stallId: number) => {
    try {
        return await reviewRepo.getReviewStatsByStallId(stallId);
    } catch (error) {
        throw error;
    }
};

export const updateReview = async (id: number, userId: number, data: any) => {
    try {
        const review = await reviewRepo.findReviewById(id);
        if (!review) throw new Error("Review not found");
        if (review.userId !== userId) throw new Error("Unauthorized to edit this review");

        if (data.rating && (data.rating < 1 || data.rating > 5)) {
            throw new Error("Rating must be between 1 and 5");
        }
        return await reviewRepo.updateReview(id, data);
    } catch (error) {
        throw error;
    }
};

export const deleteReview = async (id: number, userId: number, userRole: string) => {
    try {
        const review = await reviewRepo.findReviewById(id);
        if (!review) throw new Error("Review not found");

        // Allow if user is the owner OR if user is an admin
        if (review.userId !== userId && userRole !== 'admin') {
            throw new Error("Unauthorized to delete this review");
        }

        return await reviewRepo.deleteReview(id);
    } catch (error) {
        throw error;
    }
};
