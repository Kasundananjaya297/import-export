/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/index";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add request interceptor to add auth token
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
    (error) => {
        return Promise.reject(error);
    },
);

export const adminService = {
    async getAllUsers() {
        try {
            const response = await api.get(API_ENDPOINTS.USER.GET_ALL);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch users");
        }
    },

    async getAllStalls() {
        try {
            const response = await api.get(API_ENDPOINTS.STALL.GET_ALL);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch stalls");
        }
    },

    async updateStall(stallId: number, data: any) {
        try {
            const response = await api.put(API_ENDPOINTS.STALL.UPDATE, { id: stallId, ...data });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update stall");
        }
    },

    async deleteProduct(productId: number) {
        try {
            const response = await api.delete(API_ENDPOINTS.PRODUCT.DELETE(String(productId)));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete product");
        }
    },

    // Fish Metadata Management
    async getSpecies() {
        try {
            const response = await api.get(API_ENDPOINTS.FISH_METADATA.SPECIES.GET_ALL);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch species");
        }
    },

    async createSpecies(name: string) {
        try {
            const response = await api.post(API_ENDPOINTS.FISH_METADATA.SPECIES.CREATE, { name });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to create species");
        }
    },

    async updateSpecies(id: number, name: string) {
        try {
            const response = await api.put(API_ENDPOINTS.FISH_METADATA.SPECIES.UPDATE(id), { name });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update species");
        }
    },

    async deleteSpecies(id: number) {
        try {
            const response = await api.delete(API_ENDPOINTS.FISH_METADATA.SPECIES.DELETE(id));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete species");
        }
    },

    async getVarieties() {
        try {
            const response = await api.get(API_ENDPOINTS.FISH_METADATA.VARIETY.GET_ALL);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch varieties");
        }
    },

    async createVariety(name: string, speciesId: number) {
        try {
            const response = await api.post(API_ENDPOINTS.FISH_METADATA.VARIETY.CREATE, { name, speciesId });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to create variety");
        }
    },

    async updateVariety(id: number, name: string, speciesId: number) {
        try {
            const response = await api.put(API_ENDPOINTS.FISH_METADATA.VARIETY.UPDATE(id), { name, speciesId });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to update variety");
        }
    },

    async deleteVariety(id: number) {
        try {
            const response = await api.delete(API_ENDPOINTS.FISH_METADATA.VARIETY.DELETE(id));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to delete variety");
        }
    },

    // User Approval Management
    async getPendingUsers() {
        try {
            const response = await api.get(API_ENDPOINTS.USER.GET_PENDING);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch pending users");
        }
    },

    async approveUser(userId: number) {
        try {
            const response = await api.patch(API_ENDPOINTS.USER.APPROVE(userId));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to approve user");
        }
    },

    async rejectUser(userId: number) {
        try {
            const response = await api.patch(API_ENDPOINTS.USER.REJECT(userId));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to reject user");
        }
    },
};
