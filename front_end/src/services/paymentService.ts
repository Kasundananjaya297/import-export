/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  transactionId?: string;
  status: "pending" | "processing" | "completed" | "failed" | "refunded";
  paymentDetails?: any;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
  order?: any;
}

export interface CreatePaymentData {
  orderId: number;
  amount: number;
  paymentMethod: string;
  paymentDetails?: any;
}

export interface ProcessPaymentData {
  transactionId?: string;
  paymentDetails?: any;
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

class PaymentService {
  async createPayment(paymentData: CreatePaymentData): Promise<Payment> {
    try {
      const response = await api.post(
        API_ENDPOINTS.PAYMENT.CREATE,
        paymentData,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  async processPayment(
    paymentId: number,
    processData: ProcessPaymentData,
  ): Promise<Payment> {
    try {
      const response = await api.post(
        API_ENDPOINTS.PAYMENT.PROCESS(paymentId),
        processData,
      );
      return response.data.data;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  async getPaymentById(id: number): Promise<Payment> {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENT.GET_BY_ID(id));
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payment:", error);
      throw error;
    }
  }

  async getPaymentByOrderId(orderId: number): Promise<Payment> {
    try {
      const response = await api.get(
        API_ENDPOINTS.PAYMENT.GET_BY_ORDER_ID(orderId),
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payment by order ID:", error);
      throw error;
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      const response = await api.get(API_ENDPOINTS.PAYMENT.GET_ALL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching payments:", error);
      throw error;
    }
  }

  async updatePaymentStatus(
    paymentId: number,
    status: string,
  ): Promise<Payment> {
    try {
      const response = await api.put(
        API_ENDPOINTS.PAYMENT.UPDATE_STATUS(paymentId),
        { status },
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }

  async refundPayment(paymentId: number, reason?: string): Promise<Payment> {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENT.REFUND(paymentId), {
        reason,
      });
      return response.data.data;
    } catch (error) {
      console.error("Error refunding payment:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
