/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config/index";

export interface Species {
    id: number;
    name: string;
    varieties?: Variety[];
}

export interface Variety {
    id: number;
    name: string;
    speciesId: number;
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const metadataService = {
    async getSpecies(): Promise<Species[]> {
        try {
            const response = await api.get(API_ENDPOINTS.FISH_METADATA.SPECIES.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch species");
        }
    },

    async getVarieties(): Promise<Variety[]> {
        try {
            const response = await api.get(API_ENDPOINTS.FISH_METADATA.VARIETY.GET_ALL);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || "Failed to fetch varieties");
        }
    },
};
