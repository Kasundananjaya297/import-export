/** @format */

import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../config";

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  productId: number;
  buyerId: number;
  sellerId: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  product?: any;
  buyer?: any;
  seller?: any;
}

export interface CreateOrderData {
  productId: number;
  quantity: number;
  unitPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  notes?: string;
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
      if (userData.jwt) {
        config.headers.Authorization = `Bearer ${userData.jwt}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await api.post(API_ENDPOINTS.ORDER.CREATE, orderData);
      return response.data.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await api.get(API_ENDPOINTS.ORDER.GET_ALL);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  async getOrderById(id: number): Promise<Order> {
    try {
      const response = await api.get(
        API_ENDPOINTS.ORDER.GET_BY_ID(id.toString()),
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  async getBuyerOrders(): Promise<Order[]> {
    try {
      const response = await api.get(API_ENDPOINTS.ORDER.GET_BUYER_ORDERS);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching buyer orders:", error);
      throw error;
    }
  }

  async getSellerOrders(): Promise<Order[]> {
    try {
      const response = await api.get(API_ENDPOINTS.ORDER.GET_SELLER_ORDERS);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching seller orders:", error);
      throw error;
    }
  }

  async updateOrderStatus(id: number, status: string): Promise<Order> {
    try {
      const response = await api.put(
        API_ENDPOINTS.ORDER.UPDATE(id.toString()),
        {
          status,
        },
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  async updatePaymentStatus(id: number, paymentStatus: string): Promise<Order> {
    try {
      const response = await api.put(
        API_ENDPOINTS.ORDER.UPDATE(id.toString()),
        {
          paymentStatus,
        },
      );
      return response.data.data;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  }

  async deleteOrder(id: number): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.ORDER.DELETE(id.toString()));
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
