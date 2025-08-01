/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export interface RegisterData {
  fname: string;
  lname: string;
  gender: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  contact: string;
  company: string;
  password: string;
  role: string;
}

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

export const authService = {
  async register(data: RegisterData) {
    try {
      const response = await api.post(API_ENDPOINTS.USER.CREATE, data);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post(API_ENDPOINTS.USER.LOGIN, {
        email,
        password,
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout() {
    // Token removal is handled in AuthContext
  },

  async getCurrentUser() {
    try {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        return null;
      }
      const response = await api.get(API_ENDPOINTS.USER.GET_CURRENT);
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
    }
  },
};
