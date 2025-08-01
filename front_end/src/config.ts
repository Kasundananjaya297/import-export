/** @format */

// API Configuration
export const API_BASE_URL = "http://localhost:3000/api";

// API Endpoints
export const API_ENDPOINTS = {
  USER: {
    CREATE: "/user/create",
    LOGIN: "/user/login",
    GET_CURRENT: "/auth/me",
    UPDATE: "/user/update",
    DELETE: "/user/delete",
  },
  PRODUCT: {
    CREATE: "/products/create",
    GET_ALL: "/products/all",
    GET_BY_USER_ID: "/products",
    GET_BY_ID: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
    GET_SELLER_PRODUCTS: (sellerId: string) => `/products/seller/${sellerId}`,
  },
  ORDER: {
    CREATE: "/order/create",
    GET_ALL: "/order",
    GET_BY_ID: (id: string) => `/order/${id}`,
    UPDATE: (id: string) => `/order/${id}`,
    DELETE: (id: string) => `/order/${id}`,
    GET_BUYER_ORDERS: (buyerId: string) => `/order/buyer/${buyerId}`,
    GET_SELLER_ORDERS: (sellerId: string) => `/order/seller/${sellerId}`,
  },
  COMPLAINT: {
    CREATE: "/complaints",
    GET_ALL: "/complaints",
    GET_BY_ID: (id: string) => `/complaints/${id}`,
    UPDATE: (id: string) => `/complaints/${id}`,
    DELETE: (id: string) => `/complaints/${id}`,
    GET_USER_COMPLAINTS: (userId: string) => `/complaints/user/${userId}`,
  },
  TRANSACTION: {
    GET_ALL: "/transactions",
    GET_BY_ID: (id: string) => `/transactions/${id}`,
    GET_USER_TRANSACTIONS: (userId: string) => `/transactions/user/${userId}`,
  },
  PAYMENT: {
    CREATE: "/create",
    PROCESS: (paymentId: string) => `/${paymentId}/process`,
    UPDATE_STATUS: (paymentId: string) => `/${paymentId}/status`,
    REFUND: (paymentId: string) => `/${paymentId}/refund`,
  },
};

// App Configuration
export const APP_NAME = "Ceylon Trade";
export const APP_VERSION = "1.0.0";

// Other configuration constants can be added here
