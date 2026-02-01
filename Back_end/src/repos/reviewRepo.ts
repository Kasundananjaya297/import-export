/** @format */
import Review from "../models/reviews";
import User from "../models/users";

export const createReview = async (data: any) => {
    try {
        const review = await Review.create(data);
        return review;
    } catch (error) {
        console.error("Error in reviewRepo.createReview:", error);
        throw error;
    }
};

export const getReviewsByStallId = async (stallId: number) => {
    try {
        const reviews = await Review.findAll({
            where: { stallId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "fname", "lname"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
        return reviews;
    } catch (error) {
        console.error("Error in reviewRepo.getReviewsByStallId:", error);
        throw error;
    }
};

export const getReviewStatsByStallId = async (stallId: number) => {
    try {
        const reviews = await Review.findAll({
            where: { stallId },
            attributes: ["rating"],
        });

        if (reviews.length === 0) {
            return { averageRating: 0, totalReviews: 0 };
        }

        const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
        const average = sum / reviews.length;

        return {
            averageRating: parseFloat(average.toFixed(1)),
            totalReviews: reviews.length,
        };
    } catch (error) {
        console.error("Error in reviewRepo.getReviewStatsByStallId:", error);
        throw error;
    }
};

export const findReviewByUserAndStall = async (userId: number, stallId: number) => {
    try {
        const review = await Review.findOne({ where: { userId, stallId } });
        return review;
    } catch (error) {
        throw error;
    }
};

export const findReviewById = async (id: number) => {
    try {
        return await Review.findByPk(id);
    } catch (error) {
        throw error;
    }
};

export const updateReview = async (id: number, data: { rating: number; comment: string }) => {
    try {
        const review = await Review.findByPk(id);
        if (review) {
            await review.update(data);
            return review;
        }
        return null;
    } catch (error) {
        throw error;
    }
};

export const deleteReview = async (id: number) => {
    try {
        const review = await Review.findByPk(id);
        if (review) {
            await review.destroy();
            return true;
        }
        return false;
    } catch (error) {
        throw error;
    }
};
