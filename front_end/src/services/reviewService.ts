/** @format */
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/index";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor for auth token
api.interceptors.request.use(
    (config) => {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            if (userData.token) {
                config.headers.Authorization = `Bearer ${userData.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const reviewService = {
    async createReview(data: { stallId: number; rating: number; comment: string }) {
        try {
            const response = await api.post(API_ENDPOINTS.REVIEWS.CREATE, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to submit review");
        }
    },

    async getReviewsByStallId(stallId: number) {
        try {
            const response = await api.get(API_ENDPOINTS.REVIEWS.GET_BY_STALL(stallId));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch reviews");
        }
    },

    async updateReview(id: number, data: { rating: number; comment: string }) {
        try {
            const response = await api.patch(API_ENDPOINTS.REVIEWS.UPDATE(id), data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update review");
        }
    },

    async deleteReview(id: number) {
        try {
            const response = await api.delete(API_ENDPOINTS.REVIEWS.DELETE(id));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete review");
        }
    },
};
