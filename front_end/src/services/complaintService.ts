/** @format */

import axios from "axios";
import { API_BASE_URL } from "../config/index";

export interface Complaint {
  id: number;
  orderid: number;
  buyerid: number;
  sellerid: number;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  resolution?: string;
  createdAt: string;
  updatedAt: string;
  order?: any;
  buyer?: any;
  seller?: any;
}

export interface CreateComplaintData {
  orderid: number;
  subject: string;
  description: string;
  category: string;
  priority?: string;
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
  }
);

class ComplaintService {
  async createComplaint(complaintData: CreateComplaintData): Promise<Complaint> {
    try {
      const response = await api.post("/complaint/create", complaintData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating complaint:", error);
      throw error;
    }
  }

  async getAllComplaints(): Promise<Complaint[]> {
    try {
      const response = await api.get("/complaint/all");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching complaints:", error);
      throw error;
    }
  }

  async getComplaintById(id: number): Promise<Complaint> {
    try {
      const response = await api.get(`/complaint/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching complaint:", error);
      throw error;
    }
  }

  async getBuyerComplaints(): Promise<Complaint[]> {
    try {
      const response = await api.get("/complaint/buyer/complaints");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching buyer complaints:", error);
      throw error;
    }
  }

  async getSellerComplaints(): Promise<Complaint[]> {
    try {
      const response = await api.get("/complaint/seller/complaints");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching seller complaints:", error);
      throw error;
    }
  }

  async updateComplaint(id: number, updateData: Partial<Complaint>): Promise<Complaint> {
    try {
      const response = await api.put(`/complaint/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating complaint:", error);
      throw error;
    }
  }

  async deleteComplaint(id: number): Promise<void> {
    try {
      await api.delete(`/complaint/${id}`);
    } catch (error) {
      console.error("Error deleting complaint:", error);
      throw error;
    }
  }
}

export const complaintService = new ComplaintService();
